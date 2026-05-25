'use client';

import { useEffect, useRef } from 'react';

/**
 * Runs a refetch callback when account/artist-portal/vendor list URL state changes.
 * Skips the initial mount so server-provided initial props are preserved.
 */
export function useAccountListUrlRefresh(refreshKey: string, onRefetch: () => void): void {
  const isFirstRender = useRef(true);
  const onRefetchRef = useRef(onRefetch);

  useEffect(() => {
    onRefetchRef.current = onRefetch;
  }, [onRefetch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onRefetchRef.current();
  }, [refreshKey]);
}
