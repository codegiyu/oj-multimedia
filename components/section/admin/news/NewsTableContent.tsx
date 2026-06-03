/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import { dashboardTableDateColumn } from '@/components/general/dashboardTableColumns';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';
import { NewsActionsMenu } from './NewsActionsMenu';
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
      dashboardTableDateColumn({
        getValue: row => row.createdAt,
      }),
      dashboardTableActionsColumn(row => (
        <NewsActionsMenu newsItem={row} onEdit={onEdit} onDelete={onDelete} />
      )),
    ],
    []
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
