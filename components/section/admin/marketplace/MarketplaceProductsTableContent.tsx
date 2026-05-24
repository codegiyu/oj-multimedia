'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
  type DataTableTab,
} from '@/components/general/DataTable';
import type { IMarketplaceProduct } from '@/lib/constants/endpoints';
import { MarketplaceProductsActionsMenu } from './MarketplaceProductsActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableDateColumn } from '@/components/general/dashboardTableColumns';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface MarketplaceProductsTableContentProps {
  tabs: DataTableTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  products: IMarketplaceProduct[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: IMarketplaceProduct, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onApprove: (product: IMarketplaceProduct) => void;
  onReject: (product: IMarketplaceProduct) => void;
  onDelete: (product: IMarketplaceProduct) => void;
}

export function MarketplaceProductsTableContent({
  tabs,
  activeTab,
  onTabChange,
  products,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onApprove,
  onReject,
  onDelete,
}: MarketplaceProductsTableContentProps) {
  const columns = useMemo<DataTableColumn<IMarketplaceProduct, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.images?.[0],
        row => row.name
      ),
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.name}>{truncate(row.name, 35)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'vendor',
        header: <DataTableColumnHeader title="Vendor" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.vendorName ?? row.vendor}>
            {truncate(row.vendorName ?? String(row.vendor), 25)}
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
      {
        id: 'price',
        header: <DataTableColumnHeader title="Price" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={formatPrice(row.price)}>
            {formatPrice(row.price)}
          </DataTableCellWrapper>
        ),
      },
      dashboardTableDateColumn({
        id: 'createdAt',
        getValue: row => row.createdAt,
      }),
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: (row, _idx) => (
          <MarketplaceProductsActionsMenu
            product={row}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onApprove, onReject, onDelete]
  );

  return (
    <DataTable<IMarketplaceProduct>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabsShowNavigation={false}
      data={products}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="products"
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
