'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { ArtistVideoListItem } from '@/lib/constants/endpoints';
import { VideosActionsMenu } from './VideosActionsMenu';
import { Badge } from '@/components/ui/badge';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function artistName(artist: ArtistVideoListItem['artist']): string {
  if (!artist) return '—';
  return typeof artist === 'string' ? artist : ((artist as { name?: string }).name ?? '—');
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface VideosTableContentProps {
  videos: ArtistVideoListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: ArtistVideoListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onApprove: (video: ArtistVideoListItem) => void;
  onReject: (video: ArtistVideoListItem) => void;
  onEdit: (video: ArtistVideoListItem) => void;
  onDelete: (video: ArtistVideoListItem) => void;
}

export function VideosTableContent({
  videos,
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
}: VideosTableContentProps) {
  const columns = useMemo<DataTableColumn<ArtistVideoListItem, unknown>[]>(
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
        id: 'artist',
        header: <DataTableColumnHeader title="Artist" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={artistName(row.artist)}>
            {truncate(artistName(row.artist), 25)}
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
        cell: row => (
          <VideosActionsMenu
            video={row}
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
    <DataTable<ArtistVideoListItem>
      data={videos}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="videos"
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
