'use client';

import { type ReactNode } from 'react';
import { type DataTableColumn } from '@/components/general/DataTable';
import { cn } from '@/lib/utils';

type ActionsColumnOptions = {
  align?: 'left' | 'center' | 'right';
  header?: ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};

export function dashboardTableActionsColumn<T>(
  renderCell: (row: T, index: number) => ReactNode,
  options?: ActionsColumnOptions
): DataTableColumn<T, unknown> {
  return {
    id: 'actions',
    header: options?.header ?? null,
    meta: {
      hug: true,
      align: options?.align ?? 'center',
      cellClassName: cn('px-2 py-0', options?.cellClassName),
      headerClassName: options?.headerClassName,
    },
    cell: renderCell,
  };
}
