'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import { MusicActionsMenu } from './MusicActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { musicAlbumLabel } from '@/lib/utils/adminMusicAlbumSelect';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function artistName(artist: ArtistMusicListItem['artist']): string {
  if (!artist) return '—';
  return typeof artist === 'string' ? artist : ((artist as { name?: string }).name ?? '—');
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface MusicTableContentProps {
  music: ArtistMusicListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: ArtistMusicListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onApprove: (music: ArtistMusicListItem) => void;
  onReject: (music: ArtistMusicListItem) => void;
  onEdit: (music: ArtistMusicListItem) => void;
  onDelete: (music: ArtistMusicListItem) => void;
}

export function MusicTableContent({
  music,
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
}: MusicTableContentProps) {
  const columns = useMemo<DataTableColumn<ArtistMusicListItem, unknown>[]>(
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
          <DataTableCellWrapper text={artistName(row.artist)}>
            {truncate(artistName(row.artist), 25)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'album',
        header: <DataTableColumnHeader title="Album" />,
        meta: { width: '14%' },
        cell: row => {
          const label = musicAlbumLabel(row);
          return <DataTableCellWrapper text={label}>{truncate(label, 22)}</DataTableCellWrapper>;
        },
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '10%' },
        cell: row => (
          <DataTableCellWrapper>
            <StatusBadge status={row.status} />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'downloads',
        header: <DataTableColumnHeader title="Downloads" />,
        meta: { width: '6rem' },
        cell: row => {
          const n = (row as { downloads?: number }).downloads ?? 0;
          return <DataTableCellWrapper text={String(n)}>{n}</DataTableCellWrapper>;
        },
      },
      {
        id: 'plays',
        header: <DataTableColumnHeader title="Plays" />,
        meta: { width: '6rem' },
        cell: row => {
          const n = row.plays ?? 0;
          return <DataTableCellWrapper text={String(n)}>{n}</DataTableCellWrapper>;
        },
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
          <MusicActionsMenu
            music={row}
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
    <DataTable<ArtistMusicListItem>
      data={music}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="music tracks"
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
