'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { ResourceListItem } from '@/lib/types/community';
import { ResourcesActionsMenu } from './ResourcesActionsMenu';
import { Badge } from '@/components/ui/badge';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface ResourcesTableContentProps {
  resources: ResourceListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: ResourceListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onApprove: (resource: ResourceListItem) => void;
  onReject: (resource: ResourceListItem) => void;
  onEdit: (resource: ResourceListItem) => void;
  onDelete: (resource: ResourceListItem) => void;
}

export function ResourcesTableContent({
  resources,
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
}: ResourcesTableContentProps) {
  const columns = useMemo<DataTableColumn<ResourceListItem, unknown>[]>(
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
        id: 'type',
        header: <DataTableColumnHeader title="Type" />,
        meta: { width: '14%' },
        cell: row => <DataTableCellWrapper text={row.type}>{row.type}</DataTableCellWrapper>,
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '12%' },
        cell: row => (
          <DataTableCellWrapper>
            <StatusBadge status={(row as ResourceListItem & { status?: string }).status} />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'downloads',
        header: <DataTableColumnHeader title="Downloads" />,
        meta: { width: '10%' },
        cell: row => (
          <DataTableCellWrapper text={String(row.downloads ?? 0)}>
            {row.downloads ?? 0}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: (row, _idx) => (
          <ResourcesActionsMenu
            resource={row}
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
    <DataTable<ResourceListItem>
      data={resources}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="resources"
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
