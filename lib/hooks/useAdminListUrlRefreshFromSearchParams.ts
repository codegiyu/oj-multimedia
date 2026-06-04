'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Refetches the RSC tree when the URL search string changes.
 * Prefer this over nuqs-derived keys for tabbed SSR lists so refresh runs after the address bar updates.
 */
export function useAdminListUrlRefreshFromSearchParams(): void {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshKey = searchParams.toString();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.refresh();
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [refreshKey, router]);
}
