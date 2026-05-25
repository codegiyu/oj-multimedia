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
import type { ArtistVideoListItem } from '@/lib/constants/endpoints';
import { VideosActionsMenu } from './VideosActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';
import { AdminArtistFieldLink } from '@/components/section/admin/shared';

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
      dashboardThumbnailColumn(
        row => row.thumbnail,
        row => row.title,
        { header: 'Thumb' }
      ),
      {
        id: 'title',
        header: <DataTableColumnHeader title="Title" />,
        meta: { width: '20%' },
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
            <AdminArtistFieldLink artist={row.artist} className="line-clamp-1" />
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
      dashboardDownloadsColumn(row => row.downloads),
      dashboardPlaysColumn(row => row.plays),
      dashboardTableDateColumn({
        getValue: row => row.createdAt,
      }),
      dashboardTableActionsColumn(row => (
        <VideosActionsMenu
          video={row}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )),
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
