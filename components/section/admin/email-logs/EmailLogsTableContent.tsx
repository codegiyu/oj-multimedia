/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import { Badge } from '@/components/ui/badge';
import type { IEmailLog, IEmailLogsListRes } from '@/lib/constants/endpoints';
import { EmailLogActionsMenu } from './EmailLogActionsMenu';
import { callApi } from '@/lib/services/callApi';

// const statusOptions = [
//   { text: 'All Statuses', value: 'all' },
//   { text: 'Pending', value: 'pending' },
//   { text: 'Sent', value: 'sent' },
//   { text: 'Delivered', value: 'delivered' },
//   { text: 'Failed', value: 'failed' },
//   { text: 'Bounced', value: 'bounced' },
// ];

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'delivered':
    case 'sent':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'failed':
    case 'bounced':
      return 'destructive';
    default:
      return 'secondary';
  }
}

const tabs = [
  { value: 'all', label: 'All Emails' },
  { value: 'pending', label: 'Pending' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
  { value: 'bounced', label: 'Bounced' },
];

interface EmailLogsTableContentProps {
  page: number;
  pageSize: number;
  tab: string;
  filterStatus: string;
  refreshKey: number;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onTabChange: (value: string) => void;
  onRowClick: (row: IEmailLog, index: number) => void;
  onViewEmail: (emailLog: IEmailLog) => void;
}

export function EmailLogsTableContent({
  page,
  pageSize,
  tab,
  filterStatus,
  refreshKey,
  onRefresh,
  onPageChange,
  onTabChange,
  onRowClick,
  onViewEmail,
}: EmailLogsTableContentProps) {
  const [data, setData] = useState<IEmailLogsListRes | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', '-createdAt');
      const { data: res } = await callApi('ADMIN_EMAIL_LOGS_LIST', {
        query: `?${params.toString()}`,
      });
      setData(res ?? null);
    } catch (err) {
      console.error('Failed to fetch email logs:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterStatus, refreshKey]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const emailLogs = data?.emailLogs ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const filteredEmailLogs = useMemo(() => {
    return emailLogs.filter(log => {
      const tabMatch = tab === 'all' || log.status === tab;
      const statusMatch = filterStatus === 'all' || log.status === filterStatus;
      return tabMatch && statusMatch;
    });
  }, [emailLogs, tab, filterStatus]);

  const columns = useMemo<DataTableColumn<IEmailLog, unknown>[]>(
    () => [
      {
        id: 'to',
        header: <DataTableColumnHeader title="To" />,
        meta: { width: '25%' },
        cell: row => (
          <DataTableCellWrapper text={row.to} hasCopy copyValue={row.to ?? ''}>
            {row.to ?? '—'}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'from',
        header: <DataTableColumnHeader title="From" />,
        meta: { width: '25%' },
        cell: row => (
          <DataTableCellWrapper text={row.from ?? 'N/A'}>{row.from ?? 'N/A'}</DataTableCellWrapper>
        ),
      },
      {
        id: 'subject',
        header: <DataTableColumnHeader title="Subject" />,
        meta: { width: '35%' },
        cell: row => (
          <DataTableCellWrapper text={row.subject ?? 'N/A'}>
            {row.subject ?? 'N/A'}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'type',
        header: <DataTableColumnHeader title="Type" />,
        meta: { width: '15%' },
        cell: row => (
          <DataTableCellWrapper text={row.type ?? 'N/A'}>
            <Badge variant="outline" className="capitalize">
              {row.type ?? 'N/A'}
            </Badge>
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '6.25rem' },
        cell: row => (
          <DataTableCellWrapper text={row.status}>
            <Badge variant={getStatusVariant(row.status)} className="capitalize">
              {row.status}
            </Badge>
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'created',
        header: <DataTableColumnHeader title="Created" />,
        meta: { width: '10rem' },
        cell: row => {
          const value = row.createdAt
            ? format(new Date(row.createdAt), 'MMM d, yyyy HH:mm')
            : 'N/A';
          return (
            <DataTableCellWrapper text={value} hasCopy copyValue={value}>
              {value}
            </DataTableCellWrapper>
          );
        },
      },
      {
        id: 'actions',
        header: (
          <DataTableColumnHeader title="Actions">
            <span className="sr-only">Actions</span>
          </DataTableColumnHeader>
        ),
        meta: { align: 'center', width: '3.5rem', headerClassName: 'text-right' },
        cell: row => (
          <DataTableCellWrapper text="Actions" className="py-0 px-0">
            <EmailLogActionsMenu emailLog={row} onResend={onRefresh} onViewEmail={onViewEmail} />
          </DataTableCellWrapper>
        ),
      },
    ],
    []
  );

  return (
    <DataTable<IEmailLog>
      tabs={tabs}
      activeTab={tab}
      onTabChange={onTabChange}
      data={filteredEmailLogs}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      emptyStateWord="email logs"
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
