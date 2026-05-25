'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  buildAdminEntityHref,
  type AdminEntityRecordType,
  type BuildAdminEntityHrefOptions,
} from '@/lib/admin/entityRoutes';

export type AdminEntityLinkProps = {
  entityType: AdminEntityRecordType;
  entityId: string | null | undefined;
  children: React.ReactNode;
  className?: string;
  /** Show a small external-link icon after the label. */
  showIcon?: boolean;
  hrefOptions?: BuildAdminEntityHrefOptions;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const linkClassName =
  'underline-offset-2 hover:underline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm';

export function AdminEntityLink({
  entityType,
  entityId,
  children,
  className,
  showIcon = false,
  hrefOptions,
  onClick,
}: AdminEntityLinkProps) {
  const id = entityId?.trim() ?? '';

  if (!id) {
    return <span className={className}>{children}</span>;
  }

  const href = buildAdminEntityHref(entityType, id, hrefOptions);

  return (
    <Link
      href={href}
      className={cn(linkClassName, className)}
      onClick={event => {
        event.stopPropagation();
        onClick?.(event);
      }}>
      {children}
      {showIcon ? <ExternalLink className="ml-1 inline h-3 w-3 opacity-70" aria-hidden /> : null}
    </Link>
  );
}
