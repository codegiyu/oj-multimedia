/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { StaffListItem } from '@/lib/types/adminStaff';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';
import { StaffActionsMenu } from './StaffActionsMenu';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function formatName(row: StaffListItem) {
  return [row.firstName, row.lastName].filter(Boolean).join(' ').trim() || '—';
}

function StaffStatusBadge({ status }: { status: string }) {
  const variant =
    status === 'active'
      ? 'default'
      : status === 'invited'
        ? 'secondary'
        : status === 'suspended' || status === 'blacklisted'
          ? 'destructive'
          : 'outline';

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return <Badge variant={variant}>{label}</Badge>;
}

interface AdminStaffTableProps {
  staff: StaffListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: StaffListItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onReinvite?: (row: StaffListItem) => void;
}

export function AdminStaffTable({
  staff,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onReinvite,
}: AdminStaffTableProps) {
  const columns = useMemo<DataTableColumn<StaffListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.avatar,
        row => formatName(row),
        { header: 'Avatar', rounded: 'full' }
      ),
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={formatName(row)}>
            {truncate(formatName(row), 28)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'email',
        header: <DataTableColumnHeader title="Email" />,
        meta: { width: '24%' },
        cell: row => (
          <DataTableCellWrapper text={row.email}>{truncate(row.email, 36)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'role',
        header: <DataTableColumnHeader title="Role" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={row.primaryRoleSlug || '—'}>
            {row.primaryRoleSlug || '—'}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '12%' },
        cell: row => <StaffStatusBadge status={row.accountStatus} />,
      },
      {
        id: 'lastLogin',
        header: <DataTableColumnHeader title="Last login" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={row.lastLogin ?? '—'}>
            {row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : '—'}
          </DataTableCellWrapper>
        ),
      },
      dashboardTableActionsColumn(row => <StaffActionsMenu item={row} onReinvite={onReinvite} />),
    ],
    []
  );

  return (
    <DataTable
      data={staff}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      onRowClick={onRowClick}
      pagination={{
        currentPage: page,
        totalPages: totalPages || 1,
        onPageChange,
      }}
      emptyStateWord="admin staff"
    />
  );
}
