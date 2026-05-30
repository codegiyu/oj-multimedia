'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, type ComponentProps, type MouseEvent } from 'react';

export type AppLinkProps = ComponentProps<typeof Link> & {
  /** When prefetch is false, warm the route on hover (App Router requires manual prefetch). */
  prefetchOnHover?: boolean;
};

function resolvePrefetchableHref(href: LinkProps['href']): string | null {
  if (typeof href === 'string') {
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
    ) {
      return null;
    }

    return href;
  }

  if (href && typeof href === 'object' && 'pathname' in href) {
    const pathname = href.pathname ?? '';
    const search = href.search ?? '';
    const hash = href.hash ?? '';
    const path = `${pathname}${search}${hash}`;

    return path || null;
  }

  return null;
}

/**
 * Internal navigation link: viewport prefetch off by default to reduce scroll-time
 * RSC work; optional hover prefetch restores snappy navigations.
 */
export function AppLink({
  prefetch = false,
  prefetchOnHover = true,
  href,
  onMouseEnter,
  ...props
}: AppLinkProps) {
  const router = useRouter();
  const prefetchableHref = resolvePrefetchableHref(href);

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onMouseEnter?.(event);

      if (prefetch !== false || !prefetchOnHover || !prefetchableHref) {
        return;
      }

      router.prefetch(prefetchableHref);
    },
    [onMouseEnter, prefetch, prefetchOnHover, prefetchableHref, router]
  );

  return <Link href={href} prefetch={prefetch} onMouseEnter={handleMouseEnter} {...props} />;
}
