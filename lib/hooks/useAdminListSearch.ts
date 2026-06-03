'use client';

/**
 * Returns handlers for FilterableDataPage search wired to nuqs setters.
 * Debouncing happens in FilterableDataPage; this updates URL search and resets page.
 */
export function useAdminListSearch(
  setSearch: (value: string) => void,
  setPage: (page: number) => void
) {
  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onSearchCommit = () => {
    setPage(1);
  };

  return { onSearchChange, onSearchCommit };
}
