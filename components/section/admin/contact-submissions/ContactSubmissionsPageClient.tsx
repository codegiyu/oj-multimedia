/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
import type { ContactSubmission } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { ContactSubmissionDetailsDrawer } from './ContactSubmissionDetailsDrawer';
import { ContactSubmissionsTableContent } from './ContactSubmissionsTableContent';
import { callApi } from '@/lib/services/callApi';

const SEARCH_DEBOUNCE_MS = 300;

export function ContactSubmissionsPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchApply = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPage(1);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ContactSubmission, string> | undefined
  >(undefined);

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', '-createdAt');
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      const { data, error } = await callApi('ADMIN_CONTACT_SUBMISSIONS_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (error) {
        setSubmissions([]);
        setTotalPages(1);
        return;
      }
      const contactSubmissions =
        (data as { contactSubmissions?: ContactSubmission[] })?.contactSubmissions ?? [];
      const pagination = (data as { pagination?: { totalPages?: number } })?.pagination;
      setSubmissions(contactSubmissions);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch {
      setSubmissions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounceRef.current = setTimeout(() => fetchSubmissions(), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const handleRowClick = (row: ContactSubmission, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      <section className="grid gap-4 sm:gap-6">
        <FilterableDataPage
          searchPlaceholder="Search contact submissions..."
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchApply={handleSearchApply}
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
