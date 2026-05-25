'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ContactSubmission } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { ContactSubmissionDetailsDrawer } from './ContactSubmissionDetailsDrawer';
import { ContactSubmissionsTableContent } from './ContactSubmissionsTableContent';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';

export interface ContactSubmissionsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  submissions: ContactSubmission[];
  totalPages: number;
  listError: string | null;
}

export function ContactSubmissionsPageClient({
  pageTitle,
  pageDescription,
  submissions,
  totalPages,
  listError,
}: ContactSubmissionsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);
  useAdminListUrlRefresh(serializeAdminListUrlKey({ page, search: searchQuery }));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ContactSubmission, string> | undefined
  >(undefined);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: ContactSubmission, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search contact submissions...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
      }}
      extraContent={
        <ContactSubmissionDetailsDrawer
          clickedRowDetails={clickedRowDetails}
          setClickedRowDetails={setClickedRowDetails}
        />
      }>
      <ContactSubmissionsTableContent
        submissions={submissions}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </AdminDashboardListLayout>
  );
}
