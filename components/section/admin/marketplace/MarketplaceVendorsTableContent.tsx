/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';
import { MarketplaceVendorsActionsMenu } from './MarketplaceVendorsActionsMenu';
import { Badge } from '@/components/ui/badge';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'active' ? 'default' : status === 'pending' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface MarketplaceVendorsTableContentProps {
  vendors: IMarketplaceVendor[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: IMarketplaceVendor, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onApprove: (vendor: IMarketplaceVendor) => void;
  onReject: (vendor: IMarketplaceVendor) => void;
  onDelete: (vendor: IMarketplaceVendor) => void;
}

export function MarketplaceVendorsTableContent({
  vendors,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onApprove,
  onReject,
  onDelete,
}: MarketplaceVendorsTableContentProps) {
  const columns = useMemo<DataTableColumn<IMarketplaceVendor, unknown>[]>(
    () => [
      {
        id: 'storeName',
        header: <DataTableColumnHeader title="Store" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.storeName}>
            {truncate(row.storeName, 35)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.name}>{truncate(row.name, 25)}</DataTableCellWrapper>
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
        id: 'createdAt',
        header: <DataTableColumnHeader title="Created" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={formatDate(row.createdAt)}>
            {formatDate(row.createdAt)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: (row, _idx) => (
          <MarketplaceVendorsActionsMenu
            vendor={row}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        ),
      },
    ],
    []
  );

  return (
    <DataTable<IMarketplaceVendor>
      data={vendors}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      emptyStateWord="vendors"
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
