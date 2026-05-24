'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { MusicDetailsDrawer } from './MusicDetailsDrawer';
import { MusicTableContent } from './MusicTableContent';
import { CreateMusicModalDynamic } from './CreateMusicModalDynamic';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import { PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import type { SelectOption } from '@/lib/types/general';
import { loadAdminContentCategorySelectOptions } from '@/lib/utils/adminContentCategorySelect';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';

export interface MusicPageClientProps {
  pageTitle: string;
  pageDescription: string;
  music: ArtistMusicListItem[];
  totalPages: number;
  listError: string | null;
}

export function MusicPageClient({
  pageTitle,
  pageDescription,
  music,
  totalPages,
  listError,
}: MusicPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterCategory, setFilterCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const [sortKey, setSortKey] = useQueryState('sort', parseAsString.withDefault('newest'));
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'All', value: 'all' },
  ]);

  useEffect(() => {
    void loadAdminContentCategorySelectOptions('music').then(options => {
      setCategoryOptions([{ text: 'All', value: 'all' }, ...options.filter(o => o.value)]);
    });
  }, []);

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ArtistMusicListItem, string> | undefined
  >(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editMusicId, setEditMusicId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<ArtistMusicListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ArtistMusicListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArtistMusicListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: ArtistMusicListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_MUSIC_APPROVE', {
        query: `/${approveTarget._id}/approve` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setApproveTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_MUSIC_REJECT', {
        query: `/${rejectTarget._id}/reject` as `/${string}`,
        payload: { reason },
      });
      if (error) throw new Error(error.message);
      setRejectTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_MUSIC_DELETE', {
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

  const handleEdit = (m: ArtistMusicListItem) => {
    setEditMusicId(m._id);
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
          text="Create Music"
          onClick={() => {
            setEditMusicId(null);
            setCreateOpen(true);
          }}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search music...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
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
          {
            label: 'Category',
            value: filterCategory,
            options: categoryOptions,
            onChange: v => {
              setFilterCategory(v);
              setPage(1);
            },
          },
          {
            label: 'Sort',
            value: sortKey,
            options: [
              { text: 'Newest', value: 'newest' },
              { text: 'Downloads', value: 'downloads' },
              { text: 'Plays', value: 'plays' },
            ],
            onChange: v => {
              setSortKey(v);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
      }}
      extraContent={
        <>
          <MusicDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateMusicModalDynamic
            open={createOpen}
            onOpenChange={open => {
              if (!open) setEditMusicId(null);
              setCreateOpen(open);
            }}
            editId={editMusicId}
            onSuccess={handleRefresh}
          />

          <ApprovalModal
            open={!!approveTarget}
            onOpenChange={val => !val && setApproveTarget(null)}
            title="Approve music"
            description={approveTarget ? `Publish "${approveTarget.title}"?` : ''}
            confirmText="Approve"
            onConfirm={handleApprove}
            loading={actionLoading}
          />

          <RejectModal
            open={!!rejectTarget}
            onOpenChange={val => !val && setRejectTarget(null)}
            title="Reject music"
            description={rejectTarget ? `Reject "${rejectTarget.title}"?` : ''}
            onConfirm={handleReject}
            loading={actionLoading}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete music"
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
      <MusicTableContent
        music={music}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onApprove={m => setApproveTarget(m)}
        onReject={m => setRejectTarget(m)}
        onEdit={handleEdit}
        onDelete={m => setDeleteTarget(m)}
      />
    </AdminDashboardListLayout>
  );
}
