'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { AlbumListItem } from '@/lib/types/community';
import { AlbumsActionsMenu } from './AlbumsActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function albumArtistLabel(album: AlbumListItem): string {
  const a = album.artist;
  if (!a) return '—';
  if (typeof a === 'string') return a;
  return a.name ?? '—';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface AlbumsTableContentProps {
  albums: AlbumListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: AlbumListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (album: AlbumListItem) => void;
  onDelete: (album: AlbumListItem) => void;
}

export function AlbumsTableContent({
  albums,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: AlbumsTableContentProps) {
  const columns = useMemo<DataTableColumn<AlbumListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.coverImage,
        row => row.title
      ),
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
        meta: { width: '16%' },
        cell: row => (
          <DataTableCellWrapper text={albumArtistLabel(row)}>
            {truncate(albumArtistLabel(row), 25)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'tracks',
        header: <DataTableColumnHeader title="Tracks" />,
        meta: { width: '8%' },
        cell: row => (
          <DataTableCellWrapper text={String(row.trackCount ?? 0)}>
            {row.trackCount ?? 0}
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
        id: 'releaseDate',
        header: <DataTableColumnHeader title="Release" />,
        meta: { width: '10rem' },
        cell: row => {
          const value = row.releaseDate ? format(new Date(row.releaseDate), 'MMM d, yyyy') : '—';
          return <DataTableCellWrapper text={value}>{value}</DataTableCellWrapper>;
        },
      },
      {
        id: 'created',
        header: <DataTableColumnHeader title="Created" />,
        meta: { width: '10rem' },
        cell: row => {
          const value = row.createdAt ? format(new Date(row.createdAt), 'MMM d, yyyy') : '—';
          return <DataTableCellWrapper text={value}>{value}</DataTableCellWrapper>;
        },
      },
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: row => <AlbumsActionsMenu album={row} onEdit={onEdit} onDelete={onDelete} />,
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable<AlbumListItem>
      data={albums}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="albums"
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
