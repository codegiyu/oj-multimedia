'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { DevotionalListItem } from '@/lib/types/community';
import { DevotionalsActionsMenu } from './DevotionalsActionsMenu';
import { Badge } from '@/components/ui/badge';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface DevotionalsTableContentProps {
  devotionals: DevotionalListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: DevotionalListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onApprove: (devotional: DevotionalListItem) => void;
  onReject: (devotional: DevotionalListItem) => void;
  onEdit: (devotional: DevotionalListItem) => void;
  onDelete: (devotional: DevotionalListItem) => void;
}

export function DevotionalsTableContent({
  devotionals,
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
}: DevotionalsTableContentProps) {
  const columns = useMemo<DataTableColumn<DevotionalListItem, unknown>[]>(
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
          <DataTableCellWrapper text={row.author ?? '—'}>
            {truncate(row.author ?? '—', 25)}
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
        id: 'created',
        header: <DataTableColumnHeader title="Created" />,
        meta: { width: '12rem' },
        cell: row => {
          const value = row.createdAt ? format(new Date(row.createdAt), 'MMM d, yyyy') : '—';
          return <DataTableCellWrapper text={value}>{value}</DataTableCellWrapper>;
        },
      },
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: (row, _idx) => (
          <DevotionalsActionsMenu
            devotional={row}
            onApprove={onApprove}
            onReject={onReject}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onApprove, onReject, onEdit, onDelete]
  );

  return (
    <DataTable<DevotionalListItem>
      data={devotionals}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      emptyStateWord="devotionals"
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
