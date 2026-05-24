'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ArtistListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { ArtistsTableContent } from './ArtistsTableContent';
import { ArtistsDetailsDrawer } from './ArtistsDetailsDrawer';
import { CreateArtistModal } from './CreateArtistModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import { ARTIST_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';

export interface ArtistsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  artists: ArtistListItem[];
  totalPages: number;
  listError: string | null;
}

export function ArtistsPageClient({
  pageTitle,
  pageDescription,
  artists,
  totalPages,
  listError,
}: ArtistsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ArtistListItem, string> | undefined
  >(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editArtistId, setEditArtistId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArtistListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: ArtistListItem) => {
    setClickedRowDetails({ data: row, index: 0, tab: undefined });
  };

  const patchArtist = async (
    row: ArtistListItem,
    payload: { isActive?: boolean; isFeatured?: boolean }
  ) => {
    const { error, message } = await callApi('ADMIN_ARTIST_UPDATE', {
      query: `/${row._id}` as `/${string}`,
      payload,
    });
    if (error) {
      toast.error(error.message ?? message ?? 'Update failed');
      return;
    }
    handleRefresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_ARTIST_DELETE', {
        query: `/${deleteTarget._id}` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setDeleteTarget(null);
      setClickedRowDetails(undefined);
      handleRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      pageHeaderActions={
        <RegularBtn
          LeftIcon={Plus}
          text="Create Artist"
          onClick={() => {
            setEditArtistId(null);
            setCreateOpen(true);
          }}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search artists...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...ARTIST_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
        ],
      }}
      extraContent={
        <>
          <ArtistsDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateArtistModal
            open={createOpen}
            onOpenChange={open => {
              if (!open) setEditArtistId(null);
              setCreateOpen(open);
            }}
            editId={editArtistId}
            onSuccess={handleRefresh}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete artist"
              description={`Delete "${deleteTarget.name}"? This cannot be undone.`}
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      <ArtistsTableContent
        artists={artists}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={row => {
          setEditArtistId(row._id);
          setCreateOpen(true);
        }}
        onDelete={setDeleteTarget}
        onToggleActive={row => patchArtist(row, { isActive: row.isActive === false })}
        onToggleFeatured={row => patchArtist(row, { isFeatured: !row.isFeatured })}
      />
    </AdminDashboardListLayout>
  );
}
