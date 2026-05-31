'use client';

import { usePathname } from 'next/navigation';
import { resolveHubViewAllLink } from '@/lib/utils/hubSectionLinks';

/** Returns viewAllLink unless it matches the current pathname (hub self-link). */
export function useHubViewAllLink(viewAllLink: string | undefined): string | undefined {
  const pathname = usePathname();

  return resolveHubViewAllLink(viewAllLink, pathname);
}
