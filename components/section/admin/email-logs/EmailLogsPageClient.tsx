'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { IEmailLog } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { EmailLogDetailsDrawer } from './EmailLogDetailsDrawer';
import { EmailLogsTableContent } from './EmailLogsTableContent';
import { EMAIL_LOG_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';

const STATUS_FILTER_LABEL = 'Status';

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
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [_pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault('all'));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<IEmailLog, string> | undefined
  >(undefined);

  const handleRefresh = () => router.refresh();

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search email logs...',
        filters: [
          {
            label: STATUS_FILTER_LABEL,
            value: filterStatus,
            options: [...EMAIL_LOG_STATUS_FILTER_SELECT_OPTIONS],
            onChange: value => {
              setFilterStatus(value);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
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
        filterStatus={filterStatus}
        onRefresh={handleRefresh}
        onPageChange={setPage}
        onTabChange={value => {
          setTab(value);
          setPage(1);
        }}
        onRowClick={(row, index) => {
          setClickedRowDetails({ data: row, index, tab });
        }}
        onViewEmail={() => {}}
      />
    </AdminDashboardListLayout>
  );
}
