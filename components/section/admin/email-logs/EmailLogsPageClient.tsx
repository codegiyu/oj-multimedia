'use client';

import { useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
import type { IEmailLog } from './types';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { EmailLogDetailsDrawer } from './EmailLogDetailsDrawer';
import { EmailLogsTableContent } from './EmailLogsTableContent';

const STATUS_FILTER_LABEL = 'Status';

const statusOptions = [
  { text: 'All Statuses', value: 'all' },
  { text: 'Pending', value: 'pending' },
  { text: 'Sent', value: 'sent' },
  { text: 'Delivered', value: 'delivered' },
  { text: 'Failed', value: 'failed' },
  { text: 'Bounced', value: 'bounced' },
];

// const tabs = [
//   { value: 'all', label: 'All Emails' },
//   { value: 'pending', label: 'Pending' },
//   { value: 'sent', label: 'Sent' },
//   { value: 'delivered', label: 'Delivered' },
//   { value: 'failed', label: 'Failed' },
//   { value: 'bounced', label: 'Bounced' },
// ];

export function EmailLogsPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault('all'));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));

  const [refreshKey, setRefreshKey] = useState(0);
  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<IEmailLog, string> | undefined
  >(undefined);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const handleRowClick = (row: IEmailLog, index: number) => {
    setClickedRowDetails({ data: row, index, tab });
  };

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      <section className="grid gap-4 sm:gap-6">
        <FilterableDataPage
          searchPlaceholder="Search email logs..."
          filters={[
            {
              label: STATUS_FILTER_LABEL,
              value: filterStatus,
              options: statusOptions,
              onChange: value => {
                setFilterStatus(value);
                setPage(1);
              },
            },
          ]}
          onApplyFilters={() => setPage(1)}
        />
      </section>

      <EmailLogsTableContent
        page={page}
        pageSize={pageSize}
        tab={tab}
        filterStatus={filterStatus}
        refreshKey={refreshKey}
        onRefresh={handleRefresh}
        onPageChange={setPage}
        onTabChange={value => {
          setTab(value);
          setPage(1);
        }}
        onRowClick={handleRowClick}
        onViewEmail={() => {}}
      />

      <EmailLogDetailsDrawer
        clickedRowDetails={clickedRowDetails}
        setClickedRowDetails={setClickedRowDetails}
        onResend={handleRefresh}
      />
    </section>
  );
}
