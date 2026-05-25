'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Refetches admin dashboard server lists when URL list state changes.
 * Skips the initial mount so SSR props are not double-fetched.
 */
export function useAdminListUrlRefresh(refreshKey: string): void {
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    router.refresh();
  }, [refreshKey, router]);
}
