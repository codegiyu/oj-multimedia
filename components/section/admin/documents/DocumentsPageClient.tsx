'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { DocumentsTableContent } from './DocumentsTableContent';
import { DocumentsDetailsDrawer } from './DocumentsDetailsDrawer';
import {
  DOCUMENT_ENTITY_TYPE_FILTER_SELECT_OPTIONS,
  DOCUMENT_INTENT_FILTER_SELECT_OPTIONS,
  DOCUMENT_STATUS_FILTER_SELECT_OPTIONS,
} from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';

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
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterEntityType, setFilterEntityType] = useQueryState(
    'entityType',
    parseAsString.withDefault('all')
  );
  const [filterIntent, setFilterIntent] = useQueryState('intent', parseAsString.withDefault('all'));
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);

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
        searchPlaceholder: 'Search documents...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
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
          {
            label: 'Entity type',
            value: filterEntityType,
            options: [...DOCUMENT_ENTITY_TYPE_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterEntityType(v);
              setPage(1);
            },
          },
          {
            label: 'Intent',
            value: filterIntent,
            options: [...DOCUMENT_INTENT_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterIntent(v);
              setPage(1);
            },
          },
        ],
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
