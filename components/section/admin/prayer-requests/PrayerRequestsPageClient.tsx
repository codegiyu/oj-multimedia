'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { PrayerRequestListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { PrayerRequestsDetailsDrawer } from './PrayerRequestsDetailsDrawer';
import { PrayerRequestsTableContent } from './PrayerRequestsTableContent';
import { AnswerPrayerRequestModal } from './AnswerPrayerRequestModal';
import { PrayerRequestEditModal } from './PrayerRequestEditModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';

const statusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Active', value: 'active' },
  { text: 'Answered', value: 'answered' },
];

export interface PrayerRequestsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  prayerRequests: PrayerRequestListItem[];
  totalPages: number;
  listError: string | null;
}

export function PrayerRequestsPageClient({
  pageTitle,
  pageDescription,
  prayerRequests,
  totalPages,
  listError,
}: PrayerRequestsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<PrayerRequestListItem, string> | undefined
  >(undefined);

  const [answerTarget, setAnswerTarget] = useState<PrayerRequestListItem | null>(null);
  const [editPrayerId, setEditPrayerId] = useState<string | null>(null);
  const [editPrayerOpen, setEditPrayerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PrayerRequestListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

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
    setEditPrayerId(pr._id);
    setEditPrayerOpen(true);
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search prayer requests...',
        searchValue: searchQuery,
        onSearchChange: setSearchQuery,
        onSearchApply: () => setPage(1),
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: statusOptions,
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
      }}
      extraContent={
        <>
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

          <PrayerRequestEditModal
            open={editPrayerOpen}
            onOpenChange={open => {
              if (!open) setEditPrayerId(null);
              setEditPrayerOpen(open);
            }}
            prayerRequestId={editPrayerId}
            onSuccess={handleRefresh}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete prayer request"
              description={
                deleteTarget ? `Delete "${deleteTarget.title}"? This cannot be undone.` : ''
              }
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      <PrayerRequestsTableContent
        prayerRequests={prayerRequests}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onAnswer={m => setAnswerTarget(m)}
        onEdit={handleEdit}
        onDelete={m => setDeleteTarget(m)}
      />
    </AdminDashboardListLayout>
  );
}
