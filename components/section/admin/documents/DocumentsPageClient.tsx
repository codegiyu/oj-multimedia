'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { DocumentsTableContent } from './DocumentsTableContent';
import { DocumentsDetailsDrawer } from './DocumentsDetailsDrawer';
import { AlertCircle } from 'lucide-react';

export interface AdminDocument {
  _id: string;
  status?: string;
  entityType?: string;
  entityId?: string;
  intent?: string;
  key?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface DocumentsPageClientProps {
  documents: AdminDocument[];
  totalPages: number;
  listError: string | null;
}

export function DocumentsPageClient({
  documents,
  totalPages,
  listError,
}: DocumentsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<AdminDocument, string> | undefined
  >(undefined);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: AdminDocument, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const statusOptions = [
    { text: 'All', value: 'all' },
    { text: 'Pending', value: 'pending' },
    { text: 'Verified', value: 'verified' },
    { text: 'Rejected', value: 'rejected' },
  ];

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      {listError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{listError}</span>
        </div>
      )}
      <section className="grid gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <FilterableDataPage
            searchPlaceholder="Filter by entity type..."
            filters={[
              {
                label: 'Status',
                value: filterStatus,
                options: statusOptions,
                onChange: v => {
                  setFilterStatus(v);
                  setPage(1);
                },
              },
            ]}
            onApplyFilters={() => setPage(1)}
          />
        </div>
      </section>

      <DocumentsTableContent
        documents={documents}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DocumentsDetailsDrawer
        clickedRowDetails={clickedRowDetails}
        setClickedRowDetails={setClickedRowDetails}
        onVerify={handleRefresh}
      />
    </section>
  );
}
