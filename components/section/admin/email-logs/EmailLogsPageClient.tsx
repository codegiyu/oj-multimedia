'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { IEmailLog } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { EmailLogDetailsDrawer } from './EmailLogDetailsDrawer';
import { EmailLogsTableContent } from './EmailLogsTableContent';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { useAdminListQueryStates } from '@/lib/hooks/useAdminListQueryStates';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import {
  EMAIL_LOG_STATUS_FILTER_SELECT_OPTIONS,
  EMAIL_LOG_TYPE_FILTER_SELECT_OPTIONS,
} from '@/lib/constants/adminSelectOptions';
import { RegularInput } from '@/components/atoms/RegularInput';

export interface EmailLogsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  emailLogs: IEmailLog[];
  totalPages: number;
  listError: string | null;
}

export function EmailLogsPageClient({
  pageTitle,
  pageDescription,
  emailLogs,
  totalPages,
  listError,
}: EmailLogsPageClientProps) {
  const router = useRouter();
  const { state, setters, refreshKey } = useAdminListQueryStates('emailLogs');
  useAdminListUrlRefresh(refreshKey);

  const page = Number(state.page) || 1;
  const searchQuery = String(state.search ?? '');
  const tab = String(state.tab ?? 'all');
  const filterType = String(state.type ?? 'all');
  const filterStatus = String(state.status ?? 'all');
  const startDate = String(state.startDate ?? '');
  const endDate = String(state.endDate ?? '');
  const setPage = setters.page;

  const { onSearchChange, onSearchCommit } = useAdminListSearch(setters.search, setPage);

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<IEmailLog, string> | undefined
  >(undefined);

  const handleRefresh = () => router.refresh();

  const openEmailLog = (row: IEmailLog, index: number) => {
    setClickedRowDetails({ data: row, index, tab });
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      toolbarBeforeFilters={
        <div className="flex flex-wrap gap-3 items-end pb-2">
          <RegularInput
            label="Start date"
            type="date"
            value={startDate}
            onChange={e => setters.set({ startDate: e.target.value, page: 1 })}
            wrapClassName="min-w-[10rem]"
          />
          <RegularInput
            label="End date"
            type="date"
            value={endDate}
            onChange={e => setters.set({ endDate: e.target.value, page: 1 })}
            wrapClassName="min-w-[10rem]"
          />
        </div>
      }
      filterableDataPageProps={{
        searchPlaceholder: 'Search by to, from, or subject...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Type',
            value: filterType,
            options: [...EMAIL_LOG_TYPE_FILTER_SELECT_OPTIONS],
            onChange: v => setters.set({ type: v, page: 1 }),
          },
          {
            label: 'Status',
            value: filterStatus,
            options: [...EMAIL_LOG_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => setters.set({ status: v, page: 1 }),
          },
        ],
      }}
      extraContent={
        <EmailLogDetailsDrawer
          clickedRowDetails={clickedRowDetails}
          setClickedRowDetails={setClickedRowDetails}
          onResend={handleRefresh}
        />
      }>
      <EmailLogsTableContent
        emailLogs={emailLogs}
        totalPages={totalPages}
        page={page}
        tab={tab}
        onRefresh={handleRefresh}
        onPageChange={setPage}
        onTabChange={value => {
          setters.set({ tab: value, page: 1 });
        }}
        onRowClick={openEmailLog}
        onViewEmail={openEmailLog}
      />
    </AdminDashboardListLayout>
  );
}
