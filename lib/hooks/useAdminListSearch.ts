'use client';

import { useCallback } from 'react';

/**
 * Returns handlers for FilterableDataPage search wired to nuqs setters.
 * Debouncing happens in FilterableDataPage; this updates URL search and resets page.
 */
export function useAdminListSearch(
  setSearch: (value: string) => void,
  setPage: (page: number) => void
) {
  const onSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    [setSearch, setPage]
  );

  const onSearchCommit = useCallback(() => {
    setPage(1);
  }, [setPage]);

  return { onSearchChange, onSearchCommit };
}
