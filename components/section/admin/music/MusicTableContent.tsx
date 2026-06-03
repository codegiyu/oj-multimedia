/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import {
  dashboardDownloadsColumn,
  dashboardPlaysColumn,
  dashboardTableDateColumn,
} from '@/components/general/dashboardTableColumns';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import { MusicActionsMenu } from './MusicActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';
import { AdminArtistFieldLink, AdminMusicAlbumFieldLink } from '@/components/section/admin/shared';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
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
        meta: { width: '26%' },
        cell: row => (
          <DataTableCellWrapper text={row.title}>{truncate(row.title, 35)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'artist',
        header: <DataTableColumnHeader title="Artist" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.artist ? String(row.artist) : '—'}>
            <AdminArtistFieldLink artist={row.artist} className="line-clamp-1" />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'album',
        header: <DataTableColumnHeader title="Album" />,
        meta: { width: '16%' },
        cell: row => (
          <DataTableCellWrapper text={row.albumId ?? ''}>
            <AdminMusicAlbumFieldLink music={row} className="line-clamp-1" />
          </DataTableCellWrapper>
        ),
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
      dashboardDownloadsColumn(row => (row as { downloads?: number }).downloads),
      dashboardPlaysColumn(row => row.plays),
      dashboardTableDateColumn({
        getValue: row => row.createdAt,
      }),
      dashboardTableActionsColumn((row, _idx) => (
        <MusicActionsMenu
          music={row}
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
