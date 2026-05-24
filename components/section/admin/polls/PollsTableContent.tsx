/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { PollListItem } from '@/lib/types/community';
import { PollsActionsMenu } from './PollsActionsMenu';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';
import { Badge } from '@/components/ui/badge';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status: 'active' | 'closed' }) {
  const variant = status === 'active' ? 'default' : 'secondary';
  return <Badge variant={variant}>{status}</Badge>;
}

interface PollsTableContentProps {
  polls: PollListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: PollListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpen: (poll: PollListItem) => void;
  onClose: (poll: PollListItem) => void;
  onEdit: (poll: PollListItem) => void;
  onDelete: (poll: PollListItem) => void;
}

export function PollsTableContent({
  polls,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onOpen,
  onClose,
  onEdit,
  onDelete,
}: PollsTableContentProps) {
  const columns = useMemo<DataTableColumn<PollListItem, unknown>[]>(
    () => [
      {
        id: 'question',
        header: <DataTableColumnHeader title="Question" />,
        meta: { width: '28%' },
        cell: row => (
          <DataTableCellWrapper text={row.question}>
            {truncate(row.question, 40)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'totalVotes',
        header: <DataTableColumnHeader title="Votes" />,
        meta: { width: '10%' },
        cell: row => (
          <DataTableCellWrapper text={String(row.totalVotes)}>
            {row.totalVotes}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '12%' },
        cell: row => (
          <DataTableCellWrapper>
            <StatusBadge status={row.status} />
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
        <PollsActionsMenu
          poll={row}
          onOpen={onOpen}
          onClose={onClose}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )),
    ],
    []
  );

  return (
    <DataTable<PollListItem>
      data={polls}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="polls"
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
