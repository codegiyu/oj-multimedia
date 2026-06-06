'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ArtistListItem } from '@/lib/types/community';
import { ArtistsTableContent } from './ArtistsTableContent';
import { ArtistsDetailsDrawer } from './ArtistsDetailsDrawer';
import { CreateArtistModal } from './CreateArtistModal';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import { ARTIST_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { useAdminListQueryStates } from '@/lib/hooks/useAdminListQueryStates';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';

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
  const { state, setters, refreshKey, recordId } = useAdminListQueryStates('artists');
  useAdminListUrlRefresh(refreshKey);
  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: artists,
    recordId,
    setRecordId: setters.setRecordId,
    clearRecordId: setters.clearRecordId,
  });
  const page = Number(state.page) || 1;
  const searchQuery = String(state.search ?? '');
  const filterStatus = String(state.status ?? 'all');
  const setPage = setters.page;
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setters.search, setPage);

  const [createOpen, setCreateOpen] = useState(false);
  const [editArtistId, setEditArtistId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArtistListItem | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<ArtistListItem | null>(null);
  const [unsuspendTarget, setUnsuspendTarget] = useState<ArtistListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const patchArtist = async (
    row: ArtistListItem,
    payload: {
      isActive?: boolean;
      isFeatured?: boolean;
      isRising?: boolean;
      isMusicFeatured?: boolean;
      isCreatorSpotlight?: boolean;
    }
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

  const handleSuspend = async (reason: string) => {
    if (!suspendTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_ARTIST_SUSPEND', {
        query: `/${suspendTarget._id}/suspend` as `/${string}`,
        payload: { reason },
      });
      if (error) throw new Error(error.message);
      setSuspendTarget(null);
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Suspend failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!unsuspendTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_ARTIST_UNSUSPEND', {
        query: `/${unsuspendTarget._id}/unsuspend` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setUnsuspendTarget(null);
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unsuspend failed');
    } finally {
      setActionLoading(false);
    }
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
              setters.set({ status: v, page: 1 });
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

          <RejectModal
            open={!!suspendTarget}
            onOpenChange={val => !val && setSuspendTarget(null)}
            title="Suspend artist"
            description={suspendTarget ? `Suspend "${suspendTarget.name}"?` : ''}
            confirmText="Suspend"
            reasonLabel="Suspension reason"
            onConfirm={handleSuspend}
            loading={actionLoading}
          />

          <ApprovalModal
            open={!!unsuspendTarget}
            onOpenChange={val => !val && setUnsuspendTarget(null)}
            title="Unsuspend artist"
            description={unsuspendTarget ? `Restore "${unsuspendTarget.name}" to active?` : ''}
            confirmText="Unsuspend"
            onConfirm={handleUnsuspend}
            loading={actionLoading}
          />
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
        onToggleFeatured={row =>
          patchArtist(row, {
            isMusicFeatured: !(row.isMusicFeatured ?? row.isFeatured),
          })
        }
        onToggleRising={row => patchArtist(row, { isRising: !row.isRising })}
        onToggleSpotlight={row => patchArtist(row, { isCreatorSpotlight: !row.isCreatorSpotlight })}
        onSuspend={setSuspendTarget}
        onUnsuspend={setUnsuspendTarget}
      />
    </AdminDashboardListLayout>
  );
}
