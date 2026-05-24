/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
  type DataTableTab,
} from '@/components/general/DataTable';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';
import { MarketplaceVendorsActionsMenu } from './MarketplaceVendorsActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableDateColumn } from '@/components/general/dashboardTableColumns';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'active' ? 'default' : status === 'pending' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface MarketplaceVendorsTableContentProps {
  tabs: DataTableTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
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
  tabs,
  activeTab,
  onTabChange,
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
      dashboardThumbnailColumn(
        row => row.logo,
        row => row.storeName,
        {
          header: 'Logo',
          rounded: 'full',
        }
      ),
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
      dashboardTableDateColumn({
        id: 'createdAt',
        getValue: row => row.createdAt,
      }),
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
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabsShowNavigation={false}
      data={vendors}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
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
