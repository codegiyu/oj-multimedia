'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { StaffListItem } from '@/lib/types/adminStaff';
import { AdminStaffTable } from './AdminStaffTable';
import { AdminStaffDetailsDrawer } from './AdminStaffDetailsDrawer';
// import { NewAdminInviteDialog } from './NewAdminInviteDialog';
import { callApi } from '@/lib/services/callApi';
import { STAFF_ACCOUNT_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { useAdminListQueryStates } from '@/lib/hooks/useAdminListQueryStates';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';

export interface AdminsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  staff: StaffListItem[];
  totalPages: number;
  listError: string | null;
}

export function AdminsPageClient({
  pageTitle,
  pageDescription,
  staff,
  totalPages,
  listError,
}: AdminsPageClientProps) {
  const router = useRouter();
  const { state, setters, refreshKey, recordId } = useAdminListQueryStates('staff');
  useAdminListUrlRefresh(refreshKey);
  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: staff,
    recordId,
    setRecordId: setters.setRecordId,
    clearRecordId: setters.clearRecordId,
  });
  const page = Number(state.page) || 1;
  const searchQuery = String(state.search ?? '');
  const filterStatus = String(state.status ?? 'all');
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setters.search, setters.page);

  const [reinviteLoading, setReinviteLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleReinvite = async (row: StaffListItem) => {
    setReinviteLoading(true);
    try {
      const { error, message } = await callApi('ADMIN_STAFF_REINVITE', {
        query: `/${row._id}/reinvite` as `/${string}`,
      });
      if (error) throw new Error(message || 'Reinvite failed');
      toast.success('Invitation email resent');
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reinvite failed');
    } finally {
      setReinviteLoading(false);
    }
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      pageHeaderActions={
        <>
          {/* CLIENT-HIDDEN: Admin invite — feature deferred for client billing. Uncomment when paid.
          <NewAdminInviteDialog onSuccess={handleRefresh} />
          */}
        </>
      }
      filterableDataPageProps={{
        searchPlaceholder: 'Search staff by name or email...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...STAFF_ACCOUNT_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setters.set({ status: v, page: 1 });
            },
          },
        ],
      }}
      extraContent={
        <AdminStaffDetailsDrawer
          clickedRowDetails={clickedRowDetails}
          setClickedRowDetails={setClickedRowDetails}
          onReinvite={handleReinvite}
          reinviteLoading={reinviteLoading}
        />
      }>
      <AdminStaffTable
        staff={staff}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setters.page}
        onReinvite={handleReinvite}
      />
    </AdminDashboardListLayout>
  );
}
