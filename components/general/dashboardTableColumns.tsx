'use client';

import {
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import {
  DashboardMetricBadge,
  type DashboardMetricKind,
} from '@/components/general/DashboardMetricBadge';
import {
  ADMIN_TABLE_DATE_WIDTH,
  ADMIN_TABLE_DATETIME_WIDTH,
  ADMIN_TABLE_METRIC_WIDTH,
  formatAdminTableDate,
} from '@/lib/utils/adminTableFormat';

function metricColumn<T>(
  kind: DashboardMetricKind,
  getValue: (row: T) => number | undefined | null,
  header: string
): DataTableColumn<T, unknown> {
  return {
    id: kind,
    header: <DataTableColumnHeader title={header} />,
    meta: { width: ADMIN_TABLE_METRIC_WIDTH, align: 'center' },
    cell: row => {
      const value = getValue(row) ?? 0;
      return (
        <DataTableCellWrapper className="flex justify-center">
          <DashboardMetricBadge kind={kind} value={value} />
        </DataTableCellWrapper>
      );
    },
  };
}

export function dashboardDownloadsColumn<T>(
  getValue: (row: T) => number | undefined | null,
  header = 'Downloads'
): DataTableColumn<T, unknown> {
  return metricColumn('downloads', getValue, header);
}

export function dashboardPlaysColumn<T>(
  getValue: (row: T) => number | undefined | null,
  header = 'Plays'
): DataTableColumn<T, unknown> {
  return metricColumn('plays', getValue, header);
}

type DashboardTableDateColumnOptions<T> = {
  id?: string;
  header?: string;
  getValue: (row: T) => string | undefined | null;
  dateTime?: boolean;
  width?: string;
};

export function dashboardTableDateColumn<T>(
  options: DashboardTableDateColumnOptions<T>
): DataTableColumn<T, unknown> {
  const { dateTime, getValue, header = 'Created', id = 'created', width } = options;

  return {
    id,
    header: <DataTableColumnHeader title={header} />,
    meta: {
      width: width ?? (dateTime ? ADMIN_TABLE_DATETIME_WIDTH : ADMIN_TABLE_DATE_WIDTH),
    },
    cell: row => {
      const value = formatAdminTableDate(getValue(row), { dateTime });
      return <DataTableCellWrapper text={value}>{value}</DataTableCellWrapper>;
    },
  };
}
