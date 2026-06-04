'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { UserListItem } from '@/lib/types/adminUsers';
import { UsersTableContent } from './UsersTableContent';
import { UsersDetailsDrawer } from './UsersDetailsDrawer';
import { LinkUserProfileModal } from './LinkUserProfileModal';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import type { UnlinkedEntityKind } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { USER_ACCOUNT_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { useAdminListQueryStates } from '@/lib/hooks/useAdminListQueryStates';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';
import { formatUserDisplayName } from '@/lib/utils/formatUserDisplayName';

export interface UsersPageClientProps {
  pageTitle: string;
  pageDescription: string;
  users: UserListItem[];
  totalPages: number;
  listError: string | null;
}

type LinkKind = UnlinkedEntityKind | null;

export function UsersPageClient({
  pageTitle,
  pageDescription,
  users,
  totalPages,
  listError,
}: UsersPageClientProps) {
  const router = useRouter();
  const { state, setters, refreshKey, recordId } = useAdminListQueryStates('users');
  useAdminListUrlRefresh(refreshKey);
  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: users,
    recordId,
    setRecordId: setters.setRecordId,
    clearRecordId: setters.clearRecordId,
  });
  const page = Number(state.page) || 1;
  const searchQuery = String(state.search ?? '');
  const filterStatus = String(state.status ?? 'all');
  const setPage = setters.page;
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setters.search, setPage);

  const [suspendTarget, setSuspendTarget] = useState<UserListItem | null>(null);
  const [unsuspendTarget, setUnsuspendTarget] = useState<UserListItem | null>(null);
  const [blacklistTarget, setBlacklistTarget] = useState<UserListItem | null>(null);
  const [unblacklistTarget, setUnblacklistTarget] = useState<UserListItem | null>(null);
  const [linkKind, setLinkKind] = useState<LinkKind>(null);
  const [linkTarget, setLinkTarget] = useState<UserListItem | null>(null);
  const [unlinkArtistTarget, setUnlinkArtistTarget] = useState<UserListItem | null>(null);
  const [unlinkVendorTarget, setUnlinkVendorTarget] = useState<UserListItem | null>(null);
  const [unlinkPastorTarget, setUnlinkPastorTarget] = useState<UserListItem | null>(null);
  const [approveTarget, setApproveTarget] = useState<UserListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<UserListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const patchUser = async (
    user: UserListItem,
    payload: Record<string, string | null>,
    successMessage: string
  ) => {
    setActionLoading(true);
    try {
      const { error, message } = await callApi('ADMIN_USER_UPDATE', {
        query: `/${user._id}` as `/${string}`,
        payload,
      });
      if (error) throw new Error(error.message ?? message ?? 'Update failed');
      toast.success(successMessage);
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const openLink = (kind: UnlinkedEntityKind, user: UserListItem) => {
    setLinkKind(kind);
    setLinkTarget(user);
  };

  const closeLink = () => {
    setLinkKind(null);
    setLinkTarget(null);
  };

  const handleSuspend = async (reason: string) => {
    if (!suspendTarget) return;
    try {
      await patchUser(
        suspendTarget,
        { accountStatus: 'suspended', suspensionReason: reason },
        'User suspended'
      );
      setSuspendTarget(null);
      if (clickedRowDetails?.data._id === suspendTarget._id) {
        setClickedRowDetails(undefined);
      }
    } catch {
      /* toast shown in patchUser */
    }
  };

  const handleUnsuspend = async () => {
    if (!unsuspendTarget) return;
    try {
      await patchUser(unsuspendTarget, { accountStatus: 'active' }, 'User unsuspended');
      setUnsuspendTarget(null);
    } catch {
      /* toast shown in patchUser */
    }
  };

  const handleBlacklist = async () => {
    if (!blacklistTarget) return;
    try {
      await patchUser(blacklistTarget, { accountStatus: 'blacklisted' }, 'User blacklisted');
      setBlacklistTarget(null);
    } catch {
      /* toast shown in patchUser */
    }
  };

  const handleUnblacklist = async () => {
    if (!unblacklistTarget) return;
    try {
      await patchUser(
        unblacklistTarget,
        { accountStatus: 'active' },
        'User removed from blacklist'
      );
      setUnblacklistTarget(null);
    } catch {
      /* toast shown in patchUser */
    }
  };

  const handleUnlinkArtist = async () => {
    if (!unlinkArtistTarget) return;
    try {
      await patchUser(unlinkArtistTarget, { artistId: null }, 'Artist profile unlinked');
      setUnlinkArtistTarget(null);
    } catch {
      /* toast shown in patchUser */
    }
  };

  const handleUnlinkVendor = async () => {
    if (!unlinkVendorTarget) return;
    try {
      await patchUser(unlinkVendorTarget, { vendorId: null }, 'Vendor store unlinked');
      setUnlinkVendorTarget(null);
    } catch {
      /* toast shown in patchUser */
    }
  };

  const handleUnlinkPastor = async () => {
    if (!unlinkPastorTarget) return;
    try {
      await patchUser(unlinkPastorTarget, { pastorId: null }, 'Pastor profile unlinked');
      setUnlinkPastorTarget(null);
    } catch {
      /* toast shown in patchUser */
    }
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

  const label = (row: UserListItem) => formatUserDisplayName(row);

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

          {linkKind && linkTarget ? (
            <LinkUserProfileModal
              open
              onOpenChange={open => !open && closeLink()}
              user={linkTarget}
              entityKind={linkKind}
              onSuccess={() => {
                closeLink();
                handleRefresh();
              }}
            />
          ) : null}

          {suspendTarget ? (
            <RejectModal
              open
              onOpenChange={val => !val && setSuspendTarget(null)}
              title="Suspend user"
              description={`Suspend "${label(suspendTarget)}"? They will not be able to sign in until unsuspended.`}
              reasonLabel="Suspension reason"
              reasonPlaceholder="Reason shown to the user when they try to sign in"
              confirmText="Suspend user"
              onConfirm={handleSuspend}
              loading={actionLoading}
            />
          ) : null}

          {unsuspendTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setUnsuspendTarget(null)}
              title="Unsuspend user"
              description={`Restore sign-in access for "${label(unsuspendTarget)}"?`}
              confirmText="Unsuspend"
              onConfirm={handleUnsuspend}
              loading={actionLoading}
            />
          ) : null}

          {blacklistTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setBlacklistTarget(null)}
              title="Blacklist user"
              description={`Blacklist "${label(blacklistTarget)}"? They will be blocked from normal account use.`}
              confirmText="Blacklist"
              onConfirm={handleBlacklist}
              loading={actionLoading}
            />
          ) : null}

          {unblacklistTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setUnblacklistTarget(null)}
              title="Remove from blacklist"
              description={`Set "${label(unblacklistTarget)}" back to active?`}
              confirmText="Remove from blacklist"
              onConfirm={handleUnblacklist}
              loading={actionLoading}
            />
          ) : null}

          {unlinkArtistTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setUnlinkArtistTarget(null)}
              title="Unlink artist profile"
              description={`Remove the artist profile link from "${label(unlinkArtistTarget)}"?`}
              confirmText="Unlink"
              onConfirm={handleUnlinkArtist}
              loading={actionLoading}
            />
          ) : null}

          {unlinkVendorTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setUnlinkVendorTarget(null)}
              title="Unlink vendor store"
              description={`Remove the vendor store link from "${label(unlinkVendorTarget)}"?`}
              confirmText="Unlink"
              onConfirm={handleUnlinkVendor}
              loading={actionLoading}
            />
          ) : null}

          {unlinkPastorTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setUnlinkPastorTarget(null)}
              title="Unlink pastor profile"
              description={`Remove the pastor profile link from "${label(unlinkPastorTarget)}"?`}
              confirmText="Unlink"
              onConfirm={handleUnlinkPastor}
              loading={actionLoading}
            />
          ) : null}

          {approveTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setApproveTarget(null)}
              title="Approve account deletion"
              description={`Permanently delete the account for "${label(approveTarget)}"? This cannot be undone.`}
              confirmText="Approve deletion"
              onConfirm={handleApproveDeletion}
              loading={actionLoading}
            />
          ) : null}

          {rejectTarget ? (
            <ApprovalModal
              open
              onOpenChange={val => !val && setRejectTarget(null)}
              title="Reject deletion request"
              description={`Clear the deletion request for "${label(rejectTarget)}" and keep the account active?`}
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
        onSuspend={setSuspendTarget}
        onUnsuspend={setUnsuspendTarget}
        onBlacklist={setBlacklistTarget}
        onRemoveFromBlacklist={setUnblacklistTarget}
        onLinkArtist={row => openLink('artist', row)}
        onUnlinkArtist={setUnlinkArtistTarget}
        onLinkVendor={row => openLink('vendor', row)}
        onUnlinkVendor={setUnlinkVendorTarget}
        onLinkPastor={row => openLink('pastor', row)}
        onUnlinkPastor={setUnlinkPastorTarget}
        onApproveDeletion={setApproveTarget}
        onRejectDeletion={setRejectTarget}
      />
    </AdminDashboardListLayout>
  );
}
