/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
import type { PrayerRequestListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { PrayerRequestsDetailsDrawer } from './PrayerRequestsDetailsDrawer';
import { PrayerRequestsTableContent } from './PrayerRequestsTableContent';
import { AnswerPrayerRequestModal } from './AnswerPrayerRequestModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';

const SEARCH_DEBOUNCE_MS = 300;

const statusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Active', value: 'active' },
  { text: 'Answered', value: 'answered' },
];

export function PrayerRequestsPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<PrayerRequestListItem, string> | undefined
  >(undefined);

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [answerTarget, setAnswerTarget] = useState<PrayerRequestListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PrayerRequestListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPrayerRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', '-createdAt');
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      const { data, error } = await callApi('ADMIN_PRAYER_REQUESTS_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (error) {
        setPrayerRequests([]);
        setTotalPages(1);
        return;
      }
      const items = (data as { prayerRequests?: PrayerRequestListItem[] })?.prayerRequests ?? [];
      const pagination = (data as { pagination?: { totalPages?: number } })?.pagination;
      setPrayerRequests(items);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch {
      setPrayerRequests([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounceRef.current = setTimeout(() => fetchPrayerRequests(), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey(k => k + 1);
  const handleRowClick = (row: PrayerRequestListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_PRAYER_REQUEST_DELETE', {
        query: `/${deleteTarget._id}` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setDeleteTarget(null);
      setClickedRowDetails(undefined);
      handleRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (pr: PrayerRequestListItem) => {
    setClickedRowDetails({ data: pr, index: -1, tab: undefined });
  };

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      <section className="grid gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <FilterableDataPage
              searchPlaceholder="Search prayer requests..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchApply={() => setPage(1)}
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
        </div>
      </section>

      <PrayerRequestsTableContent
        prayerRequests={prayerRequests}
        loading={loading}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onAnswer={m => setAnswerTarget(m)}
        onEdit={handleEdit}
        onDelete={m => setDeleteTarget(m)}
      />

      <PrayerRequestsDetailsDrawer
        clickedRowDetails={clickedRowDetails}
        setClickedRowDetails={setClickedRowDetails}
      />

      <AnswerPrayerRequestModal
        open={!!answerTarget}
        onOpenChange={val => !val && setAnswerTarget(null)}
        prayerRequest={answerTarget}
        onSuccess={handleRefresh}
      />

      {deleteTarget && (
        <ApprovalModal
          open={!!deleteTarget}
          onOpenChange={val => !val && setDeleteTarget(null)}
          title="Delete prayer request"
          description={deleteTarget ? `Delete "${deleteTarget.title}"? This cannot be undone.` : ''}
          confirmText="Delete"
          onConfirm={handleDelete}
          loading={actionLoading}
        />
      )}
    </section>
  );
}
