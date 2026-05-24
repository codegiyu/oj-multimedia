'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { AlbumListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { AlbumsDetailsDrawer } from './AlbumsDetailsDrawer';
import { AlbumsTableContent } from './AlbumsTableContent';
import { CreateAlbumModal } from './CreateAlbumModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import { PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';

export interface AlbumsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  albums: AlbumListItem[];
  totalPages: number;
  listError: string | null;
}

export function AlbumsPageClient({
  pageTitle,
  pageDescription,
  albums,
  totalPages,
  listError,
}: AlbumsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<AlbumListItem, string> | undefined
  >(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AlbumListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: AlbumListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_ALBUM_DELETE', {
        query: `/${deleteTarget._id}` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setDeleteTarget(null);
      setClickedRowDetails(undefined);
      handleRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (album: AlbumListItem) => {
    setEditAlbumId(album._id);
    setCreateOpen(true);
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      pageHeaderActions={
        <RegularBtn
          LeftIcon={Plus}
          text="Create Album"
          onClick={() => {
            setEditAlbumId(null);
            setCreateOpen(true);
          }}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search albums...',
        searchValue: searchQuery,
        onSearchChange: setSearchQuery,
        onSearchApply: () => setPage(1),
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
      }}
      extraContent={
        <>
          <AlbumsDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateAlbumModal
            open={createOpen}
            onOpenChange={open => {
              if (!open) setEditAlbumId(null);
              setCreateOpen(open);
            }}
            editId={editAlbumId}
            onSuccess={handleRefresh}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete album"
              description={
                deleteTarget ? `Delete "${deleteTarget.title}"? This cannot be undone.` : ''
              }
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      <AlbumsTableContent
        albums={albums}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={album => setDeleteTarget(album)}
      />
    </AdminDashboardListLayout>
  );
}
