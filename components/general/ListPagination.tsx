'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ListPaginationProps {
  /** Current 1-based page */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items (optional, for "Showing X–Y of Z") */
  total?: number;
  /** Items per page (optional, for "Showing X–Y of Z") */
  limit?: number;
  /** Optional class for the wrapper */
  className?: string;
}

/**
 * URL-based list pagination. Uses ?page=N query param and preserves other search params.
 */
export function ListPagination({ page, totalPages, total, limit, className }: ListPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (newPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(newPage));
    }
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  };

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  const rangeText =
    total != null && limit != null && total > 0
      ? `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`
      : null;

  return (
    <nav
      className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}
      aria-label="Pagination">
      {rangeText && <p className="text-sm text-muted-foreground order-2 sm:order-1">{rangeText}</p>}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!prevPage}
          aria-label="Previous page"
          asChild={!!prevPage}>
          {prevPage ? (
            <Link href={buildPageUrl(prevPage)} className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>
          ) : (
            <span className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </span>
          )}
        </Button>
        <span className="text-sm text-muted-foreground px-2" aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!nextPage}
          aria-label="Next page"
          asChild={!!nextPage}>
          {nextPage ? (
            <Link href={buildPageUrl(nextPage)} className="gap-1">
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="gap-1">
              Next
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </nav>
  );
}
