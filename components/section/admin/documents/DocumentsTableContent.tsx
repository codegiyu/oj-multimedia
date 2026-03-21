'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { AdminDocument } from './DocumentsPageClient';
import { Badge } from '@/components/ui/badge';

function StatusBadge({ status }: { status?: string }) {
  const variant =
    status === 'verified' ? 'default' : status === 'pending' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface DocumentsTableContentProps {
  documents: AdminDocument[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: AdminDocument, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DocumentsTableContent({
  documents,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
}: DocumentsTableContentProps) {
  const columns = useMemo<DataTableColumn<AdminDocument, unknown>[]>(
    () => [
      {
        id: 'entityType',
        header: <DataTableColumnHeader title="Entity Type" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.entityType ?? '—'}>
            {row.entityType ?? '—'}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'intent',
        header: <DataTableColumnHeader title="Intent" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.intent ?? '—'}>{row.intent ?? '—'}</DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper>
            <StatusBadge status={row.status} />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'created',
        header: <DataTableColumnHeader title="Created" />,
        meta: { width: '14rem' },
        cell: row => {
          const value = row.createdAt ? format(new Date(row.createdAt), 'MMM d, yyyy HH:mm') : '—';
          return <DataTableCellWrapper text={value}>{value}</DataTableCellWrapper>;
        },
      },
    ],
    []
  );

  return (
    <DataTable<AdminDocument>
      data={documents}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      emptyStateWord="documents"
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
