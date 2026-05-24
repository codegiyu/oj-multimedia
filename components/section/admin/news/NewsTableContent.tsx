'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';
import { NewsActionsMenu } from './NewsActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface NewsTableContentProps {
  news: PublicNewsListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: PublicNewsListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (newsItem: PublicNewsListItem) => void;
  onDelete: (newsItem: PublicNewsListItem) => void;
}

export function NewsTableContent({
  news,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: NewsTableContentProps) {
  const columns = useMemo<DataTableColumn<PublicNewsListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.coverImage,
        row => row.title
      ),
      {
        id: 'title',
        header: <DataTableColumnHeader title="Title" />,
        meta: { width: '30%' },
        cell: row => (
          <DataTableCellWrapper text={row.title}>{truncate(row.title, 45)}</DataTableCellWrapper>
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
        cell: row => <NewsActionsMenu newsItem={row} onEdit={onEdit} onDelete={onDelete} />,
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable<PublicNewsListItem>
      data={news}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="news articles"
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
