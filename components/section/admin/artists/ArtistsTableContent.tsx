'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { ArtistListItem } from '@/lib/types/community';
import { ArtistsActionsMenu } from './ArtistsActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function ActiveBadge({ isActive }: { isActive?: boolean }) {
  return (
    <Badge variant={isActive === false ? 'secondary' : 'default'}>
      {isActive === false ? 'Inactive' : 'Active'}
    </Badge>
  );
}

interface ArtistsTableContentProps {
  artists: ArtistListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: ArtistListItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (row: ArtistListItem) => void;
  onDelete: (row: ArtistListItem) => void;
  onToggleActive: (row: ArtistListItem) => void;
  onToggleFeatured: (row: ArtistListItem) => void;
  onToggleRising?: (row: ArtistListItem) => void;
  onToggleSpotlight?: (row: ArtistListItem) => void;
  onSuspend?: (row: ArtistListItem) => void;
  onUnsuspend?: (row: ArtistListItem) => void;
}

export function ArtistsTableContent({
  artists,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onToggleRising,
  onToggleSpotlight,
  onSuspend,
  onUnsuspend,
}: ArtistsTableContentProps) {
  const columns = useMemo<DataTableColumn<ArtistListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.image,
        row => row.name,
        { header: 'Photo', rounded: 'full' }
      ),
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.name}>{truncate(row.name, 30)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'genre',
        header: <DataTableColumnHeader title="Genre" />,
        meta: { width: '16%' },
        cell: row => (
          <DataTableCellWrapper text={row.genre ?? '—'}>{row.genre ?? '—'}</DataTableCellWrapper>
        ),
      },
      {
        id: 'slug',
        header: <DataTableColumnHeader title="Slug" />,
        meta: { width: '20%' },
        cell: row => (
          <DataTableCellWrapper text={row.slug}>{truncate(row.slug, 25)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '8rem' },
        cell: row => (
          <DataTableCellWrapper>
            <ActiveBadge isActive={row.isActive} />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'featured',
        header: <DataTableColumnHeader title="Featured" />,
        meta: { width: '6.25rem' },
        cell: row => (
          <DataTableCellWrapper>
            {row.isMusicFeatured || row.isFeatured ? (
              <Badge variant="outline">Yes</Badge>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </DataTableCellWrapper>
        ),
      },
      dashboardTableActionsColumn(row => (
        <ArtistsActionsMenu
          item={row}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onToggleFeatured={onToggleFeatured}
          onToggleRising={onToggleRising}
          onToggleSpotlight={onToggleSpotlight}
          onSuspend={onSuspend}
          onUnsuspend={onUnsuspend}
        />
      )),
    ],
    [
      onEdit,
      onDelete,
      onToggleActive,
      onToggleFeatured,
      onToggleRising,
      onToggleSpotlight,
      onSuspend,
      onUnsuspend,
    ]
  );

  return (
    <DataTable<ArtistListItem>
      data={artists}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="artists"
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
