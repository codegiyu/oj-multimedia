'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import type { ContactSubmission } from '@/lib/constants/endpoints';

interface ContactSubmissionsTableContentProps {
  submissions: ContactSubmission[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: ContactSubmission, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

export function ContactSubmissionsTableContent({
  submissions,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
}: ContactSubmissionsTableContentProps) {
  const columns = useMemo<DataTableColumn<ContactSubmission, unknown>[]>(
    () => [
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '18%' },
        cell: row => <DataTableCellWrapper text={row.name}>{row.name}</DataTableCellWrapper>,
      },
      {
        id: 'phone',
        header: <DataTableColumnHeader title="Phone" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={row.phone} hasCopy copyValue={row.phone}>
            {row.phone}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'email',
        header: <DataTableColumnHeader title="Email" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.email ?? '—'}>{row.email ?? '—'}</DataTableCellWrapper>
        ),
      },
      {
        id: 'subject',
        header: <DataTableColumnHeader title="Subject" />,
        meta: { width: '20%' },
        cell: row => (
          <DataTableCellWrapper text={row.subject}>
            {truncate(row.subject, 40)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'message',
        header: <DataTableColumnHeader title="Message" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.message}>
            {truncate(row.message, 50)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'created',
        header: <DataTableColumnHeader title="Created" />,
        meta: { width: '10rem' },
        cell: row => {
          const value = row.createdAt ? format(new Date(row.createdAt), 'MMM d, yyyy HH:mm') : '—';
          return <DataTableCellWrapper text={value}>{value}</DataTableCellWrapper>;
        },
      },
    ],
    []
  );

  return (
    <DataTable<ContactSubmission>
      data={submissions}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      emptyStateWord="contact submissions"
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
