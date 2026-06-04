'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { PastorListItem } from '@/lib/types/community';
import { PastorsActionsMenu } from './PastorsActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

interface PastorsTableContentProps {
  pastors: PastorListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: PastorListItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (row: PastorListItem) => void;
  onDelete: (row: PastorListItem) => void;
  onToggleActive: (row: PastorListItem) => void;
  onToggleFeatured: (row: PastorListItem) => void;
  onSuspend?: (row: PastorListItem) => void;
  onUnsuspend?: (row: PastorListItem) => void;
}

export function PastorsTableContent({
  pastors,
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
  onSuspend,
  onUnsuspend,
}: PastorsTableContentProps) {
  const columns = useMemo<DataTableColumn<PastorListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.image,
        row => row.name,
        { header: 'Photo', rounded: 'full' }
      ),
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '20%' },
        cell: row => (
          <DataTableCellWrapper text={row.name}>{truncate(row.name, 28)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'title',
        header: <DataTableColumnHeader title="Title" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.title ?? '—'}>{row.title ?? '—'}</DataTableCellWrapper>
        ),
      },
      {
        id: 'church',
        header: <DataTableColumnHeader title="Church" />,
        meta: { width: '20%' },
        cell: row => (
          <DataTableCellWrapper text={row.church ?? '—'}>
            {truncate(row.church ?? '—', 25)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '8rem' },
        cell: row => (
          <DataTableCellWrapper>
            <Badge variant={row.isActive === false ? 'secondary' : 'default'}>
              {row.isActive === false ? 'Inactive' : 'Active'}
            </Badge>
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'featured',
        header: <DataTableColumnHeader title="Featured" />,
        meta: { width: '6.25rem' },
        cell: row => (
          <DataTableCellWrapper>
            {row.isFeatured ? (
              <Badge variant="outline">Yes</Badge>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </DataTableCellWrapper>
        ),
      },
      dashboardTableActionsColumn(row => (
        <PastorsActionsMenu
          item={row}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onToggleFeatured={onToggleFeatured}
          onSuspend={onSuspend}
          onUnsuspend={onUnsuspend}
        />
      )),
    ],
    [onEdit, onDelete, onToggleActive, onToggleFeatured, onSuspend, onUnsuspend]
  );

  return (
    <DataTable<PastorListItem>
      data={pastors}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="pastors"
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
