'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ResourceListItem } from '@/lib/types/community';
import { ResourcesDetailsDrawer } from './ResourcesDetailsDrawer';
import { ResourcesTableContent } from './ResourcesTableContent';
import { CreateResourceModal } from './CreateResourceModal';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import {
  PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS,
  RESOURCE_TYPE_FILTER_SELECT_OPTIONS,
} from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminListRecordId } from '@/lib/hooks/useAdminListRecordId';
import { useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';
import { useAdminCategoryFilterOptions } from '@/lib/hooks/useAdminCategoryFilterOptions';

export interface ResourcesPageClientProps {
  pageTitle: string;
  pageDescription: string;
  resources: ResourceListItem[];
  totalPages: number;
  listError: string | null;
}

export function ResourcesPageClient({
  pageTitle,
  pageDescription,
  resources,
  totalPages,
  listError,
}: ResourcesPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterCategory, setFilterCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const [filterType, setFilterType] = useQueryState('type', parseAsString.withDefault('all'));
  const categoryOptions = useAdminCategoryFilterOptions('resource');
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);
  useAdminListUrlRefresh(
    serializeAdminListUrlKey({
      page,
      search: searchQuery,
      status: filterStatus,
      category: filterCategory,
      type: filterType,
    })
  );
  const { recordId, setRecordId, clearRecordId } = useAdminListRecordId();
  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: resources,
    recordId,
    setRecordId,
    clearRecordId,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editResourceId, setEditResourceId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<ResourceListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ResourceListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResourceListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleApprove = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_RESOURCE_APPROVE', {
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
      const { error } = await callApi('ADMIN_RESOURCE_REJECT', {
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
      const { error } = await callApi('ADMIN_RESOURCE_DELETE', {
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

  const handleEdit = (r: ResourceListItem) => {
    setEditResourceId(r._id);
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
          text="Create Resource"
          onClick={() => {
            setEditResourceId(null);
            setCreateOpen(true);
          }}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search resources...',
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
            label: 'Type',
            value: filterType,
            options: [...RESOURCE_TYPE_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterType(v);
              setPage(1);
            },
          },
        ],
      }}
      extraContent={
        <>
          <ResourcesDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateResourceModal
            open={createOpen}
            onOpenChange={open => {
              if (!open) setEditResourceId(null);
              setCreateOpen(open);
            }}
            editId={editResourceId}
            onSuccess={handleRefresh}
          />

          <ApprovalModal
            open={!!approveTarget}
            onOpenChange={val => !val && setApproveTarget(null)}
            title="Approve resource"
            description={approveTarget ? `Publish "${approveTarget.title}"?` : ''}
            confirmText="Approve"
            onConfirm={handleApprove}
            loading={actionLoading}
          />

          <RejectModal
            open={!!rejectTarget}
            onOpenChange={val => !val && setRejectTarget(null)}
            title="Reject resource"
            description={rejectTarget ? `Reject "${rejectTarget.title}"?` : ''}
            onConfirm={handleReject}
            loading={actionLoading}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete resource"
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
      <ResourcesTableContent
        resources={resources}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onApprove={r => setApproveTarget(r)}
        onReject={r => setRejectTarget(r)}
        onEdit={handleEdit}
        onDelete={r => setDeleteTarget(r)}
      />
    </AdminDashboardListLayout>
  );
}
