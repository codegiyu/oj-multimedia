'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { PastorListItem } from '@/lib/types/community';
import { PastorsTableContent } from './PastorsTableContent';
import { PastorsDetailsDrawer } from './PastorsDetailsDrawer';
import { CreatePastorModal } from './CreatePastorModal';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import { PASTOR_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { useAdminListQueryStates } from '@/lib/hooks/useAdminListQueryStates';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';

export interface PastorsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  pastors: PastorListItem[];
  totalPages: number;
  listError: string | null;
}

export function PastorsPageClient({
  pageTitle,
  pageDescription,
  pastors,
  totalPages,
  listError,
}: PastorsPageClientProps) {
  const router = useRouter();
  const { state, setters, refreshKey, recordId } = useAdminListQueryStates('pastors');
  useAdminListUrlRefresh(refreshKey);
  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: pastors,
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
  const [editPastorId, setEditPastorId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PastorListItem | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<PastorListItem | null>(null);
  const [unsuspendTarget, setUnsuspendTarget] = useState<PastorListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const patchPastor = async (
    row: PastorListItem,
    payload: { isActive?: boolean; isFeatured?: boolean }
  ) => {
    const { error, message } = await callApi('ADMIN_PASTOR_UPDATE', {
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
      const { error } = await callApi('ADMIN_PASTOR_SUSPEND', {
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
      const { error } = await callApi('ADMIN_PASTOR_UNSUSPEND', {
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
      const { error } = await callApi('ADMIN_PASTOR_DELETE', {
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
          text="Create Pastor"
          onClick={() => {
            setEditPastorId(null);
            setCreateOpen(true);
          }}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search pastors...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...PASTOR_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setters.set({ status: v, page: 1 });
            },
          },
        ],
      }}
      extraContent={
        <>
          <PastorsDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreatePastorModal
            open={createOpen}
            onOpenChange={open => {
              if (!open) setEditPastorId(null);
              setCreateOpen(open);
            }}
            editId={editPastorId}
            onSuccess={handleRefresh}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete pastor"
              description={`Delete "${deleteTarget.name}"? This cannot be undone.`}
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}

          <RejectModal
            open={!!suspendTarget}
            onOpenChange={val => !val && setSuspendTarget(null)}
            title="Suspend pastor"
            description={suspendTarget ? `Suspend "${suspendTarget.name}"?` : ''}
            confirmText="Suspend"
            reasonLabel="Suspension reason"
            onConfirm={handleSuspend}
            loading={actionLoading}
          />

          <ApprovalModal
            open={!!unsuspendTarget}
            onOpenChange={val => !val && setUnsuspendTarget(null)}
            title="Unsuspend pastor"
            description={unsuspendTarget ? `Restore "${unsuspendTarget.name}" to active?` : ''}
            confirmText="Unsuspend"
            onConfirm={handleUnsuspend}
            loading={actionLoading}
          />
        </>
      }>
      <PastorsTableContent
        pastors={pastors}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={row => {
          setEditPastorId(row._id);
          setCreateOpen(true);
        }}
        onDelete={setDeleteTarget}
        onToggleActive={row => patchPastor(row, { isActive: row.isActive === false })}
        onToggleFeatured={row => patchPastor(row, { isFeatured: !row.isFeatured })}
        onSuspend={setSuspendTarget}
        onUnsuspend={setUnsuspendTarget}
      />
    </AdminDashboardListLayout>
  );
}
