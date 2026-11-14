'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Refetches admin dashboard server lists when the committed URL changes.
 * Uses useSearchParams (the actual URL) rather than nuqs React state so the
 * refresh fires only after nuqs has committed its startTransition, avoiding
 * the race where router.refresh() ran before the URL update landed.
 *
 * The _refreshKey param is kept for call-site compatibility but is ignored.
 */
export function useAdminListUrlRefresh(_refreshKey?: string): void {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const urlKey = searchParams.toString();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    router.refresh();
  }, [urlKey, router]);
}
