'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { PollListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { PollsDetailsDrawer } from './PollsDetailsDrawer';
import { PollsTableContent } from './PollsTableContent';
import { CreatePollModal } from './CreatePollModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';

const statusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Active', value: 'active' },
  { text: 'Closed', value: 'closed' },
];

export interface PollsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  polls: PollListItem[];
  totalPages: number;
  listError: string | null;
}

export function PollsPageClient({
  pageTitle,
  pageDescription,
  polls,
  totalPages,
  listError,
}: PollsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<PollListItem, string> | undefined
  >(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [openTarget, setOpenTarget] = useState<PollListItem | null>(null);
  const [closeTarget, setCloseTarget] = useState<PollListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PollListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: PollListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleOpen = async () => {
    if (!openTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_POLL_OPEN', {
        query: `/${openTarget._id}/open` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setOpenTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Open poll failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!closeTarget) return;
    setActionLoading(true);
    try {
      const reason = 'Closed by admin';
      const { error } = await callApi('ADMIN_POLL_CLOSE', {
        query: `/${closeTarget._id}/close` as `/${string}`,
        payload: { reason },
      });
      if (error) throw new Error(error.message);
      setCloseTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Close poll failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_POLL_DELETE', {
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

  const handleEdit = (p: PollListItem) => {
    setClickedRowDetails({ data: p, index: -1, tab: undefined });
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      pageHeaderActions={
        <RegularBtn LeftIcon={Plus} text="Create Poll" onClick={() => setCreateOpen(true)} />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search polls...',
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
          <PollsDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreatePollModal
            open={createOpen}
            onOpenChange={setCreateOpen}
            onSuccess={handleRefresh}
          />

          <ApprovalModal
            open={!!openTarget}
            onOpenChange={val => !val && setOpenTarget(null)}
            title="Open poll"
            description={openTarget ? `Open "${openTarget.question}" for voting?` : ''}
            confirmText="Open"
            onConfirm={handleOpen}
            loading={actionLoading}
          />

          <ApprovalModal
            open={!!closeTarget}
            onOpenChange={val => !val && setCloseTarget(null)}
            title="Close poll"
            description={closeTarget ? `Close "${closeTarget.question}"?` : ''}
            confirmText="Close"
            onConfirm={handleClose}
            loading={actionLoading}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete poll"
              description={
                deleteTarget ? `Delete "${deleteTarget.question}"? This cannot be undone.` : ''
              }
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      <PollsTableContent
        polls={polls}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onOpen={p => setOpenTarget(p)}
        onClose={p => setCloseTarget(p)}
        onEdit={handleEdit}
        onDelete={p => setDeleteTarget(p)}
      />
    </AdminDashboardListLayout>
  );
}
