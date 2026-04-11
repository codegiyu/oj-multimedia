'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import type { ContactSubmission } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { ContactSubmissionDetailsDrawer } from './ContactSubmissionDetailsDrawer';
import { ContactSubmissionsTableContent } from './ContactSubmissionsTableContent';
import { AlertCircle } from 'lucide-react';

export interface ContactSubmissionsPageClientProps {
  submissions: ContactSubmission[];
  totalPages: number;
  listError: string | null;
}

export function ContactSubmissionsPageClient({
  submissions,
  totalPages,
  listError,
}: ContactSubmissionsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ContactSubmission, string> | undefined
  >(undefined);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: ContactSubmission, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      {listError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{listError}</span>
        </div>
      )}
      <section className="grid gap-4 sm:gap-6">
        <FilterableDataPage
          searchPlaceholder="Search contact submissions..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchApply={() => setPage(1)}
        />
      </section>

      <ContactSubmissionsTableContent
        submissions={submissions}
        loading={false}
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
