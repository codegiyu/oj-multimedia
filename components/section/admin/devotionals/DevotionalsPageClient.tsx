'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { DevotionalListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { DevotionalsDetailsDrawer } from './DevotionalsDetailsDrawer';
import { DevotionalsTableContent } from './DevotionalsTableContent';
import { CreateDevotionalModal } from './CreateDevotionalModal';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import { PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminCategoryFilterOptions } from '@/lib/hooks/useAdminCategoryFilterOptions';
import { useAdminArtistFilterOptions } from '@/lib/hooks/useAdminArtistFilterOptions';

export interface DevotionalsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  devotionals: DevotionalListItem[];
  totalPages: number;
  listError: string | null;
}

export function DevotionalsPageClient({
  pageTitle,
  pageDescription,
  devotionals,
  totalPages,
  listError,
}: DevotionalsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterCategory, setFilterCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const [filterArtist, setFilterArtist] = useQueryState('artist', parseAsString.withDefault('all'));
  const categoryOptions = useAdminCategoryFilterOptions('devotional');
  const artistOptions = useAdminArtistFilterOptions();
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);
  useAdminListUrlRefresh(
    serializeAdminListUrlKey({
      page,
      search: searchQuery,
      status: filterStatus,
      category: filterCategory,
      artist: filterArtist,
    })
  );

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<DevotionalListItem, string> | undefined
  >(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editDevotionalId, setEditDevotionalId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<DevotionalListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<DevotionalListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DevotionalListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: DevotionalListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_DEVOTIONAL_APPROVE', {
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
      const { error } = await callApi('ADMIN_DEVOTIONAL_REJECT', {
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
      const { error } = await callApi('ADMIN_DEVOTIONAL_DELETE', {
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

  const handleEdit = (d: DevotionalListItem) => {
    setEditDevotionalId(d._id);
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
          text="Create Devotional"
          onClick={() => {
            setEditDevotionalId(null);
            setCreateOpen(true);
          }}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search devotionals...',
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
            label: 'Artist',
            value: filterArtist,
            options: artistOptions,
            onChange: v => {
              setFilterArtist(v);
              setPage(1);
            },
          },
        ],
      }}
      extraContent={
        <>
          <DevotionalsDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateDevotionalModal
            open={createOpen}
            onOpenChange={open => {
              if (!open) setEditDevotionalId(null);
              setCreateOpen(open);
            }}
            editId={editDevotionalId}
            onSuccess={handleRefresh}
          />

          <ApprovalModal
            open={!!approveTarget}
            onOpenChange={val => !val && setApproveTarget(null)}
            title="Approve devotional"
            description={approveTarget ? `Publish "${approveTarget.title}"?` : ''}
            confirmText="Approve"
            onConfirm={handleApprove}
            loading={actionLoading}
          />

          <RejectModal
            open={!!rejectTarget}
            onOpenChange={val => !val && setRejectTarget(null)}
            title="Reject devotional"
            description={rejectTarget ? `Reject "${rejectTarget.title}"?` : ''}
            onConfirm={handleReject}
            loading={actionLoading}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete devotional"
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
      <DevotionalsTableContent
        devotionals={devotionals}
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
