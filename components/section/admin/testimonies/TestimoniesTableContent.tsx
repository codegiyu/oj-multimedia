/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { TestimonyListItem } from '@/lib/types/community';
import { TestimoniesActionsMenu } from './TestimoniesActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface TestimoniesTableContentProps {
  testimonies: TestimonyListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: TestimonyListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onApprove: (testimony: TestimonyListItem) => void;
  onReject: (testimony: TestimonyListItem) => void;
  onEdit: (testimony: TestimonyListItem) => void;
  onDelete: (testimony: TestimonyListItem) => void;
}

export function TestimoniesTableContent({
  testimonies,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: TestimoniesTableContentProps) {
  const columns = useMemo<DataTableColumn<TestimonyListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.avatar,
        row => row.author,
        {
          header: 'Avatar',
          rounded: 'full',
        }
      ),
      {
        id: 'author',
        header: <DataTableColumnHeader title="Author" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.author}>{truncate(row.author, 25)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'content',
        header: <DataTableColumnHeader title="Content" />,
        meta: { width: '30%' },
        cell: row => (
          <DataTableCellWrapper text={row.content}>
            {truncate(row.content, 45)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '12%' },
        cell: row => (
          <DataTableCellWrapper>
            <StatusBadge status={(row as { status?: string }).status} />
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
        <TestimoniesActionsMenu
          testimony={row}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )),
    ],
    []
  );

  return (
    <DataTable<TestimonyListItem>
      data={testimonies}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="testimonies"
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
