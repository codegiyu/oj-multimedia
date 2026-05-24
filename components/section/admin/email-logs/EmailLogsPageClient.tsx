'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { IEmailLog } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { EmailLogDetailsDrawer } from './EmailLogDetailsDrawer';
import { EmailLogsTableContent } from './EmailLogsTableContent';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';

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
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault('all'));
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);

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
      filterableDataPageProps={{
        searchPlaceholder: 'Search by to, from, or subject...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
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
          setTab(value);
          setPage(1);
        }}
        onRowClick={openEmailLog}
        onViewEmail={openEmailLog}
      />
    </AdminDashboardListLayout>
  );
}
