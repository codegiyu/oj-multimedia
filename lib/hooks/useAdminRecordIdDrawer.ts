'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';

export type ResolvedAdminRecord<T, Tab extends string = string> = {
  row: T;
  index: number;
  tab?: Tab;
};

export type UseAdminRecordIdDrawerOptions<T, Tab extends string = string> = {
  rows: T[];
  recordId: string | null;
  setRecordId: (id: string | null) => void;
  clearRecordId: () => void;
  getRowId?: (row: T) => string;
  getTab?: (row: T) => Tab | undefined;
  /** When the active list rows may not include the record (e.g. marketplace tabs). */
  resolveRecord?: (recordId: string) => ResolvedAdminRecord<T, Tab> | null;
};

export function findRowIndexById<T>(
  rows: T[],
  recordId: string,
  getRowId: (row: T) => string
): number {
  const target = recordId.trim();
  if (!target) return -1;

  return rows.findIndex(row => getRowId(row) === target);
}

/** Sync `?id=` in the URL with list row drawer open/close state. */
export function useAdminRecordIdDrawer<T, Tab extends string = string>({
  rows,
  recordId,
  setRecordId,
  clearRecordId,
  getRowId = row => String((row as { _id: string })._id),
  getTab,
  resolveRecord,
}: UseAdminRecordIdDrawerOptions<T, Tab>) {
  const [clickedRowDetails, setClickedRowDetailsState] = useState<
    ClickedRowDetails<T, Tab> | undefined
  >(undefined);

  const setClickedRowDetails = useCallback(
    (value: ClickedRowDetails<T, Tab> | undefined) => {
      setClickedRowDetailsState(value);
      if (!value) {
        clearRecordId();
      }
    },
    [clearRecordId]
  );

  useEffect(() => {
    if (!recordId) {
      return;
    }

    if (resolveRecord) {
      const resolved = resolveRecord(recordId);
      if (!resolved) {
        return;
      }

      setClickedRowDetailsState({
        data: resolved.row,
        index: resolved.index,
        tab: resolved.tab,
      });
      return;
    }

    const index = findRowIndexById(rows, recordId, getRowId);
    if (index < 0) {
      return;
    }

    const row = rows[index];
    setClickedRowDetailsState({
      data: row,
      index,
      tab: getTab?.(row),
    });
  }, [recordId, rows, getRowId, getTab, resolveRecord]);

  const handleRowClick = useCallback(
    (row: T, index = 0, tab?: Tab) => {
      const id = getRowId(row);
      setRecordId(id);
      setClickedRowDetailsState({
        data: row,
        index,
        tab: tab ?? getTab?.(row),
      });
    },
    [getRowId, getTab, setRecordId]
  );

  const onDrawerOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setClickedRowDetails(undefined);
      }
    },
    [setClickedRowDetails]
  );

  return {
    clickedRowDetails,
    setClickedRowDetails,
    handleRowClick,
    onDrawerOpenChange,
  };
}
