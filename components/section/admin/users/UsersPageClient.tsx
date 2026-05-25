'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { UserListItem } from '@/lib/types/adminUsers';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { UsersTableContent } from './UsersTableContent';
import { UsersDetailsDrawer } from './UsersDetailsDrawer';
import { ManageUserModal } from './ManageUserModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { USER_ACCOUNT_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { useAdminListQueryStates } from '@/lib/hooks/useAdminListQueryStates';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';

export interface UsersPageClientProps {
  pageTitle: string;
  pageDescription: string;
  users: UserListItem[];
  totalPages: number;
  listError: string | null;
}

export function UsersPageClient({
  pageTitle,
  pageDescription,
  users,
  totalPages,
  listError,
}: UsersPageClientProps) {
  const router = useRouter();
  const { state, setters, refreshKey } = useAdminListQueryStates('users');
  useAdminListUrlRefresh(refreshKey);
  const page = Number(state.page) || 1;
  const searchQuery = String(state.search ?? '');
  const filterStatus = String(state.status ?? 'all');
  const setPage = setters.page;
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setters.search, setPage);

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<UserListItem, string> | undefined
  >(undefined);
  const [manageTarget, setManageTarget] = useState<UserListItem | null>(null);
  const [approveTarget, setApproveTarget] = useState<UserListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<UserListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: UserListItem) => {
    setClickedRowDetails({ data: row, index: 0, tab: undefined });
  };

  const handleApproveDeletion = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_USER_APPROVE_DELETION', {
        query: `/${approveTarget._id}/approve-deletion` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      toast.success('Account deletion approved');
      setApproveTarget(null);
      setClickedRowDetails(undefined);
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDeletion = async () => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_USER_REJECT_DELETION', {
        query: `/${rejectTarget._id}/reject-deletion` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      toast.success('Deletion request rejected');
      setRejectTarget(null);
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const deletionLabel = (row: UserListItem) =>
    [row.firstName, row.lastName].filter(Boolean).join(' ').trim() || row.email;

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search users by name or email...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...USER_ACCOUNT_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setters.set({ status: v, page: 1 });
            },
          },
        ],
      }}
      extraContent={
        <>
          <UsersDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <ManageUserModal
            open={!!manageTarget}
            onOpenChange={open => !open && setManageTarget(null)}
            user={manageTarget}
            onSuccess={handleRefresh}
          />

          {approveTarget ? (
            <ApprovalModal
              open={!!approveTarget}
              onOpenChange={val => !val && setApproveTarget(null)}
              title="Approve account deletion"
              description={`Permanently delete the account for "${deletionLabel(approveTarget)}"? This cannot be undone.`}
              confirmText="Approve deletion"
              onConfirm={handleApproveDeletion}
              loading={actionLoading}
            />
          ) : null}

          {rejectTarget ? (
            <ApprovalModal
              open={!!rejectTarget}
              onOpenChange={val => !val && setRejectTarget(null)}
              title="Reject deletion request"
              description={`Clear the deletion request for "${deletionLabel(rejectTarget)}" and keep the account active?`}
              confirmText="Reject request"
              onConfirm={handleRejectDeletion}
              loading={actionLoading}
            />
          ) : null}
        </>
      }>
      <UsersTableContent
        users={users}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onManage={setManageTarget}
        onApproveDeletion={setApproveTarget}
        onRejectDeletion={setRejectTarget}
      />
    </AdminDashboardListLayout>
  );
}
