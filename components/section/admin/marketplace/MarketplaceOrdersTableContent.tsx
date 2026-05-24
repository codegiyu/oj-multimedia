'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
  type DataTableTab,
} from '@/components/general/DataTable';
import type { PopulatedMarketplaceOrder } from '@/lib/constants/endpoints';
import { Badge } from '@/components/ui/badge';
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
  const variant =
    status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface MarketplaceOrdersTableContentProps {
  tabs: DataTableTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  orders: PopulatedMarketplaceOrder[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: PopulatedMarketplaceOrder, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MarketplaceOrdersTableContent({
  tabs,
  activeTab,
  onTabChange,
  orders,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
}: MarketplaceOrdersTableContentProps) {
  const columns = useMemo<DataTableColumn<PopulatedMarketplaceOrder, unknown>[]>(
    () => [
      {
        id: 'orderNumber',
        header: <DataTableColumnHeader title="Order #" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.orderNumber}>
            {truncate(row.orderNumber, 20)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'customer',
        header: <DataTableColumnHeader title="Customer" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.customer?.name ?? '—'}>
            {truncate(row.customer?.name ?? '—', 30)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'totalAmount',
        header: <DataTableColumnHeader title="Total" />,
        meta: { width: '16%' },
        cell: row => (
          <DataTableCellWrapper text={formatPrice(row.totalAmount)}>
            {formatPrice(row.totalAmount)}
          </DataTableCellWrapper>
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
      dashboardTableDateColumn({
        id: 'createdAt',
        getValue: row => row.createdAt,
      }),
    ],
    []
  );

  return (
    <DataTable<PopulatedMarketplaceOrder>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabsShowNavigation={false}
      data={orders}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="orders"
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
