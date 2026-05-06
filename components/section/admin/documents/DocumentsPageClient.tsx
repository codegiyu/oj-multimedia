'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { DocumentsTableContent } from './DocumentsTableContent';
import { DocumentsDetailsDrawer } from './DocumentsDetailsDrawer';
import { DOCUMENT_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';

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
  pageTitle: string;
  pageDescription: string;
  documents: AdminDocument[];
  totalPages: number;
  listError: string | null;
}

export function DocumentsPageClient({
  pageTitle,
  pageDescription,
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

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Filter by entity type...',
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...DOCUMENT_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
      }}
      extraContent={
        <DocumentsDetailsDrawer
          clickedRowDetails={clickedRowDetails}
          setClickedRowDetails={setClickedRowDetails}
          onVerify={handleRefresh}
        />
      }>
      <DocumentsTableContent
        documents={documents}
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
