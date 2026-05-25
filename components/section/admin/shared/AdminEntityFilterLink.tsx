'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  buildAdminEntityFilterHref,
  type AdminEntityFilterTarget,
  type BuildAdminEntityFilterHrefOptions,
} from '@/lib/admin/entityRoutes';

export type AdminEntityFilterLinkProps = {
  target: AdminEntityFilterTarget;
  filterId: string | null | undefined;
  children: React.ReactNode;
  className?: string;
  hrefOptions?: BuildAdminEntityFilterHrefOptions;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const linkClassName =
  'underline-offset-2 hover:underline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm';

/** Links to a list page filtered by artist, vendor, or category. */
export function AdminEntityFilterLink({
  target,
  filterId,
  children,
  className,
  hrefOptions,
  onClick,
}: AdminEntityFilterLinkProps) {
  const id = filterId?.trim() ?? '';

  if (!id) {
    return <span className={className}>{children}</span>;
  }

  const href = buildAdminEntityFilterHref(target, id, hrefOptions);

  return (
    <Link
      href={href}
      className={cn(linkClassName, className)}
      onClick={event => {
        event.stopPropagation();
        onClick?.(event);
      }}>
      {children}
    </Link>
  );
}
