import type { CSSProperties } from 'react';

export interface DataTableColumnMetaLike {
  width?: number | string;
  hug?: boolean;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  cellClassName?: string;
}

export function getDataTableColumnWidthStyle(
  meta?: DataTableColumnMetaLike
): CSSProperties | undefined {
  if (meta?.hug) return undefined;

  if (typeof meta?.width === 'number') return { width: `${meta.width}px` };
  if (meta?.width) return { width: meta.width };

  return undefined;
}

/** Shrink-to-fit column class for `table-fixed` layouts (thumbnail, actions). */
export function getDataTableHugClassName(meta?: Pick<DataTableColumnMetaLike, 'hug'>): string {
  return meta?.hug ? 'w-0 whitespace-nowrap' : '';
}

/** Inline HTML tables outside DataTable (home adverts, content categories). */
export const DASHBOARD_INLINE_TABLE_HUG_CLASS = 'w-0 whitespace-nowrap';
