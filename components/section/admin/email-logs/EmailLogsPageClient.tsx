'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import type { IEmailLog } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { EmailLogDetailsDrawer } from './EmailLogDetailsDrawer';
import { EmailLogsTableContent } from './EmailLogsTableContent';
import { AlertCircle } from 'lucide-react';

const STATUS_FILTER_LABEL = 'Status';

const statusOptions = [
  { text: 'All Statuses', value: 'all' },
  { text: 'Pending', value: 'pending' },
  { text: 'Sent', value: 'sent' },
  { text: 'Delivered', value: 'delivered' },
  { text: 'Failed', value: 'failed' },
  { text: 'Bounced', value: 'bounced' },
];

export interface EmailLogsPageClientProps {
  emailLogs: IEmailLog[];
  totalPages: number;
  listError: string | null;
}

export function EmailLogsPageClient({
  emailLogs,
  totalPages,
  listError,
}: EmailLogsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [_pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault('all'));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<IEmailLog, string> | undefined
  >(undefined);

  const handleRefresh = () => router.refresh();

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      {listError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{listError}</span>
        </div>
      )}
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
        emailLogs={emailLogs}
        totalPages={totalPages}
        page={page}
        tab={tab}
        filterStatus={filterStatus}
        onRefresh={handleRefresh}
        onPageChange={setPage}
        onTabChange={value => {
          setTab(value);
          setPage(1);
        }}
        onRowClick={(row, index) => {
          setClickedRowDetails({ data: row, index, tab });
        }}
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
