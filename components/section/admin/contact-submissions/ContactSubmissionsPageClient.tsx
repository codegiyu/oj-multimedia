/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
import type { ContactSubmission } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { ContactSubmissionDetailsDrawer } from './ContactSubmissionDetailsDrawer';
import { ContactSubmissionsTableContent } from './ContactSubmissionsTableContent';

/**
 * Contact submissions management (UI only).
 * When the backend exposes an admin list endpoint (e.g. GET /admin/contact-submissions),
 * wire it here: call the API, set submissions and pagination from the response.
 */
export function ContactSubmissionsPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));

  const [refreshKey, setRefreshKey] = useState(0);
  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ContactSubmission, string> | undefined
  >(undefined);

  // UI only: no API yet. Replace with API response when backend adds admin list endpoint.
  const [submissions] = useState<ContactSubmission[]>([]);
  const loading = false;
  const totalPages = 1;

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    // When API exists: refetch and set submissions + totalPages
  };

  const handleRowClick = (row: ContactSubmission, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      <section className="grid gap-4 sm:gap-6">
        <FilterableDataPage
          searchPlaceholder="Search contact submissions..."
          onApplyFilters={() => setPage(1)}
        />
      </section>

      <ContactSubmissionsTableContent
        submissions={submissions}
        loading={loading}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ContactSubmissionDetailsDrawer
        clickedRowDetails={clickedRowDetails}
        setClickedRowDetails={setClickedRowDetails}
      />
    </section>
  );
}
