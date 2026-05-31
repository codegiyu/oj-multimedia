'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { IPastorApplicationListItem } from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { useAdminListQueryStates } from '@/lib/hooks/useAdminListQueryStates';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';

const STATUS_OPTIONS = [
  { value: 'all', text: 'All' },
  { value: 'pending', text: 'Pending' },
  { value: 'approved', text: 'Approved' },
  { value: 'rejected', text: 'Rejected' },
];

export interface PastorApplicationsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  applications: IPastorApplicationListItem[];
  totalPages: number;
  listError: string | null;
}

export function PastorApplicationsPageClient({
  pageTitle,
  pageDescription,
  applications,
  totalPages,
  listError,
}: PastorApplicationsPageClientProps) {
  const router = useRouter();
  const { state, setters, refreshKey } = useAdminListQueryStates('pastors');
  useAdminListUrlRefresh(refreshKey);
  const page = Number(state.page) || 1;
  const searchQuery = String(state.search ?? '');
  const filterStatus = String(state.status ?? 'all');
  const setPage = setters.page;
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setters.search, setPage);
  const [actionId, setActionId] = useState<string | null>(null);

  const handleRefresh = () => router.refresh();

  const approve = async (id: string) => {
    setActionId(id);
    const res = await callApi('ADMIN_PASTOR_APPLICATION_APPROVE', {
      query: `/${id}/approve` as `/${string}/approve`,
    });
    setActionId(null);
    if (res.error) {
      toast.error(res.error.message ?? 'Approve failed');
      return;
    }
    toast.success('Application approved.');
    handleRefresh();
  };

  const reject = async (id: string) => {
    const reason = window.prompt('Rejection reason (optional)') ?? '';
    setActionId(id);
    const res = await callApi('ADMIN_PASTOR_APPLICATION_REJECT', {
      query: `/${id}/reject` as `/${string}/reject`,
      payload: { reason },
    });
    setActionId(null);
    if (res.error) {
      toast.error(res.error.message ?? 'Reject failed');
      return;
    }
    toast.success('Application rejected.');
    handleRefresh();
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search applications...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: STATUS_OPTIONS,
            onChange: v => {
              setters.set({ status: v, page: 1 });
            },
          },
        ],
      }}>
      <div className="grid gap-4">
        {applications.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No applications found.
          </Card>
        ) : (
          applications.map(app => {
            const userLabel =
              app.user && typeof app.user === 'object'
                ? [app.user.firstName, app.user.lastName].filter(Boolean).join(' ') ||
                  app.user.email
                : '—';

            return (
              <Card key={app._id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{app.name}</h3>
                      <Badge variant="outline">{app.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {app.title ? `${app.title} · ` : ''}
                      {app.church ?? '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">Applicant: {userLabel}</p>
                    {app.motivation ? (
                      <p className="text-sm line-clamp-2">{app.motivation}</p>
                    ) : null}
                  </div>
                  {app.status === 'pending' ? (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => approve(app._id)}
                        disabled={actionId === app._id}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reject(app._id)}
                        disabled={actionId === app._id}>
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      ) : null}
    </AdminDashboardListLayout>
  );
}
