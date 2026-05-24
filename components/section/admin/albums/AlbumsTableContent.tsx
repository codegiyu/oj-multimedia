'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import { dashboardTableDateColumn } from '@/components/general/dashboardTableColumns';
import type { AlbumListItem } from '@/lib/types/community';
import { AlbumsActionsMenu } from './AlbumsActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';

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
      dashboardTableDateColumn({
        id: 'releaseDate',
        header: 'Release',
        getValue: row => row.releaseDate,
      }),
      dashboardTableDateColumn({
        id: 'created',
        header: 'Created',
        getValue: row => row.createdAt,
      }),
      dashboardTableActionsColumn(row => (
        <AlbumsActionsMenu album={row} onEdit={onEdit} onDelete={onDelete} />
      )),
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
