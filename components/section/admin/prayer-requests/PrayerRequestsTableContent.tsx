/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { PrayerRequestListItem } from '@/lib/types/community';
import { PrayerRequestsActionsMenu } from './PrayerRequestsActionsMenu';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';
import { Badge } from '@/components/ui/badge';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'answered' ? 'default' : 'secondary';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface PrayerRequestsTableContentProps {
  prayerRequests: PrayerRequestListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: PrayerRequestListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAnswer: (prayerRequest: PrayerRequestListItem) => void;
  onEdit: (prayerRequest: PrayerRequestListItem) => void;
  onDelete: (prayerRequest: PrayerRequestListItem) => void;
}

export function PrayerRequestsTableContent({
  prayerRequests,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onAnswer,
  onEdit,
  onDelete,
}: PrayerRequestsTableContentProps) {
  const columns = useMemo<DataTableColumn<PrayerRequestListItem, unknown>[]>(
    () => [
      {
        id: 'title',
        header: <DataTableColumnHeader title="Title" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.title}>{truncate(row.title, 35)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'author',
        header: <DataTableColumnHeader title="Author" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.author}>{truncate(row.author, 25)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '12%' },
        cell: row => (
          <DataTableCellWrapper>
            <StatusBadge status={(row as PrayerRequestListItem & { status?: string }).status} />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'timeAgo',
        header: <DataTableColumnHeader title="Posted" />,
        meta: { width: '12rem' },
        cell: row => <DataTableCellWrapper text={row.timeAgo}>{row.timeAgo}</DataTableCellWrapper>,
      },
      dashboardTableActionsColumn((row, _idx) => (
        <PrayerRequestsActionsMenu
          prayerRequest={row}
          onAnswer={onAnswer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )),
    ],
    []
  );

  return (
    <DataTable<PrayerRequestListItem>
      data={prayerRequests}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="prayer requests"
      pagination={{
        currentPage: page,
        totalPages: totalPages || 1,
        onPageChange,
      }}
      getRowId={row => row._id}
      onRowClick={onRowClick}
    />
  );
}
