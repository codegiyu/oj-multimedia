/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { DocumentsTableContent } from './DocumentsTableContent';
import { DocumentsDetailsDrawer } from './DocumentsDetailsDrawer';
import { callApi } from '@/lib/services/callApi';

const SEARCH_DEBOUNCE_MS = 300;

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

export function DocumentsPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<AdminDocument, string> | undefined
  >(undefined);

  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', '-createdAt');
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      const { data, error } = await callApi('ADMIN_DOCUMENTS_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (error) {
        setDocuments([]);
        setTotalPages(1);
        return;
      }
      const items = (data?.documents ?? []) as AdminDocument[];
      const pagination = (data as { pagination?: { totalPages?: number } })?.pagination;
      setDocuments(items);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch {
      setDocuments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounceRef.current = setTimeout(() => fetchDocuments(), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey(k => k + 1);
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
        loading={loading}
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
