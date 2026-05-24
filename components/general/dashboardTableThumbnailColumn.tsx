'use client';

import {
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';

type ThumbnailColumnOptions = {
  header?: string;
  rounded?: 'md' | 'full';
  size?: number;
};

export function dashboardThumbnailColumn<T>(
  getSrc: (row: T) => string | null | undefined,
  getAlt: (row: T) => string,
  options?: ThumbnailColumnOptions
): DataTableColumn<T, unknown> {
  return {
    id: 'thumbnail',
    header: <DataTableColumnHeader title={options?.header ?? 'Cover'} />,
    meta: { width: '3.5rem' },
    cell: row => (
      <DataTableCellWrapper>
        <DashboardThumbnail
          src={getSrc(row)}
          alt={getAlt(row)}
          size={options?.size ?? 40}
          rounded={options?.rounded ?? 'md'}
        />
      </DataTableCellWrapper>
    ),
  };
}
