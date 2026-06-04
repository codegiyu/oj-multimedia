'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import { RejectModal } from '@/components/section/admin/shared';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import type { IRoleProfileAppealSummary } from '@/lib/types/rolePortal';
import { Badge } from '@/components/ui/badge';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';

export interface RoleProfileAppealsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  appeals: IRoleProfileAppealSummary[];
  totalPages: number;
  listError: string | null;
}

export function RoleProfileAppealsPageClient({
  pageTitle,
  pageDescription,
  appeals,
  totalPages,
  listError,
}: RoleProfileAppealsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState(
    'status',
    parseAsString.withDefault('pending')
  );
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);
  useAdminListUrlRefresh(
    serializeAdminListUrlKey({ page, search: searchQuery, status: filterStatus })
  );

  const [acceptTarget, setAcceptTarget] = useState<IRoleProfileAppealSummary | null>(null);
  const [rejectTarget, setRejectTarget] = useState<IRoleProfileAppealSummary | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleAccept = async () => {
    if (!acceptTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_ROLE_PROFILE_APPEAL_ACCEPT', {
        query: `/${acceptTarget._id}/accept` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setAcceptTarget(null);
      toast.success('Appeal accepted');
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Accept failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (adminResponse: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_ROLE_PROFILE_APPEAL_REJECT', {
        query: `/${rejectTarget._id}/reject` as `/${string}`,
        payload: { adminResponse },
      });
      if (error) throw new Error(error.message);
      setRejectTarget(null);
      toast.success('Appeal rejected');
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reject failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = appeals.filter(row => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.message.toLowerCase().includes(q) ||
      (row.profileType ?? '').toLowerCase().includes(q) ||
      (row.profileId ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search appeals...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [
              { text: 'Pending', value: 'pending' },
              { text: 'Accepted', value: 'accepted' },
              { text: 'Rejected', value: 'rejected' },
              { text: 'All', value: 'all' },
            ],
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
        ],
      }}
      extraContent={
        <>
          <ApprovalModal
            open={!!acceptTarget}
            onOpenChange={val => !val && setAcceptTarget(null)}
            title="Accept appeal"
            description={
              acceptTarget
                ? `Accept this ${acceptTarget.profileType ?? 'profile'} appeal and restore the profile?`
                : ''
            }
            confirmText="Accept"
            onConfirm={handleAccept}
            loading={actionLoading}
          />

          <RejectModal
            open={!!rejectTarget}
            onOpenChange={val => !val && setRejectTarget(null)}
            title="Reject appeal"
            description={rejectTarget ? 'Provide a response to the user.' : ''}
            confirmText="Reject"
            reasonLabel="Response to user"
            reasonPlaceholder="Explain why the appeal was rejected"
            onConfirm={handleReject}
            loading={actionLoading}
          />
        </>
      }>
      <div className="rounded-xl border border-border overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Profile</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No appeals found.
                </td>
              </tr>
            ) : (
              filtered.map(row => (
                <tr key={row._id} className="border-t border-border/70">
                  <td className="px-4 py-3 capitalize">
                    {row.profileType ?? '—'}
                    {row.profileId ? (
                      <span className="block text-xs text-muted-foreground font-mono truncate max-w-[10rem]">
                        {row.profileId}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    <p className="line-clamp-2">{row.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row.status === 'pending' ? 'secondary' : 'outline'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {row.status === 'pending' ? (
                      <>
                        <RegularBtn size="sm" text="Accept" onClick={() => setAcceptTarget(row)} />
                        <RegularBtn
                          size="sm"
                          variant="destructive"
                          text="Reject"
                          onClick={() => setRejectTarget(row)}
                        />
                      </>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages}. Change status filter to load another page from the server.
      </p>
    </AdminDashboardListLayout>
  );
}
