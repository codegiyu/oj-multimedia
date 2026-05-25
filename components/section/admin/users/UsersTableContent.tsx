/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { UserListItem } from '@/lib/types/adminUsers';
import { UsersActionsMenu } from './UsersActionsMenu';
import { Badge } from '@/components/ui/badge';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';
import { dashboardTableActionsColumn } from '@/components/general/dashboardTableActionsColumn';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function formatName(row: UserListItem) {
  return [row.firstName, row.lastName].filter(Boolean).join(' ').trim() || '—';
}

function AccountStatusBadge({
  status,
  pendingDeletion,
}: {
  status: string;
  pendingDeletion: boolean;
}) {
  if (pendingDeletion) {
    return <Badge variant="destructive">Deletion pending</Badge>;
  }

  const variant =
    status === 'active'
      ? 'default'
      : status === 'suspended' || status === 'blacklisted'
        ? 'destructive'
        : 'secondary';

  const label = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');

  return <Badge variant={variant}>{label}</Badge>;
}

interface UsersTableContentProps {
  users: UserListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: UserListItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onManage: (row: UserListItem) => void;
  onApproveDeletion: (row: UserListItem) => void;
  onRejectDeletion: (row: UserListItem) => void;
}

export function UsersTableContent({
  users,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onManage,
  onApproveDeletion,
  onRejectDeletion,
}: UsersTableContentProps) {
  const columns = useMemo<DataTableColumn<UserListItem, unknown>[]>(
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
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.email}>{truncate(row.email, 32)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '9rem' },
        cell: row => (
          <DataTableCellWrapper>
            <AccountStatusBadge
              status={row.accountStatus}
              pendingDeletion={Boolean(row.deleteRequestedAt)}
            />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'artist',
        header: <DataTableColumnHeader title="Artist" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={row.linkedArtistName ?? '—'}>
            {row.linkedArtistName ? truncate(row.linkedArtistName, 22) : '—'}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'vendor',
        header: <DataTableColumnHeader title="Vendor" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={row.linkedVendorName ?? '—'}>
            {row.linkedVendorName ? truncate(row.linkedVendorName, 22) : '—'}
          </DataTableCellWrapper>
        ),
      },
      dashboardTableActionsColumn(row => (
        <UsersActionsMenu
          item={row}
          onManage={onManage}
          onApproveDeletion={onApproveDeletion}
          onRejectDeletion={onRejectDeletion}
        />
      )),
    ],
    []
  );

  return (
    <DataTable<UserListItem>
      data={users}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="users"
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
