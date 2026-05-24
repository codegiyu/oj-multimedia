'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import { dashboardTableDateColumn } from '@/components/general/dashboardTableColumns';
import { Badge } from '@/components/ui/badge';
import type { IGospelVerse } from '@/lib/types/server-models';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

interface GospelVersesTableContentProps {
  gospelVerses: IGospelVerse[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: IGospelVerse, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GospelVersesTableContent({
  gospelVerses,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
}: GospelVersesTableContentProps) {
  const columns = useMemo<DataTableColumn<IGospelVerse, unknown>[]>(
    () => [
      {
        id: 'reference',
        header: <DataTableColumnHeader title="Reference" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={row.reference}>{row.reference}</DataTableCellWrapper>
        ),
      },
      {
        id: 'verse',
        header: <DataTableColumnHeader title="Verse" />,
        meta: { width: '42%' },
        cell: row => (
          <DataTableCellWrapper text={row.verse}>{truncate(row.verse, 120)}</DataTableCellWrapper>
        ),
      },
      dashboardTableDateColumn({
        id: 'date',
        header: 'Verse date',
        getValue: row => row.date,
      }),
      {
        id: 'active',
        header: <DataTableColumnHeader title="Active" />,
        meta: { width: '6.25rem' },
        cell: row => (
          <DataTableCellWrapper>
            <Badge variant={row.isActive ? 'default' : 'secondary'}>
              {row.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </DataTableCellWrapper>
        ),
      },
      dashboardTableDateColumn({
        id: 'updated',
        header: 'Updated',
        getValue: row => row.updatedAt,
      }),
    ],
    []
  );

  return (
    <DataTable<IGospelVerse>
      data={gospelVerses}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="gospel verses"
      pagination={{
        currentPage: page,
        totalPages,
        onPageChange,
      }}
      getRowId={row => row._id}
      onRowClick={onRowClick}
    />
  );
}
