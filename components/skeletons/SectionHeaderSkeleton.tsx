'use client';

import { type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface SectionHeaderSkeletonProps {
  showViewAll?: boolean;
  showPrevNext?: boolean;
  extraActions?: ReactNode;
  tabs?: number;
  className?: string;
}

export function SectionHeaderSkeleton({
  showViewAll = true,
  showPrevNext = false,
  extraActions,
  tabs = 0,
  className,
}: SectionHeaderSkeletonProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div>
            <Skeleton className="h-7 md:h-8 w-36 mb-2" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showPrevNext ? (
            <>
              <Skeleton className="h-10 w-10 rounded-md hidden md:block" />
              <Skeleton className="h-10 w-10 rounded-md hidden md:block" />
            </>
          ) : null}
          {extraActions}
          {showViewAll ? <Skeleton className="h-10 w-24 rounded-lg" /> : null}
        </div>
      </div>

      {tabs > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: tabs }, (_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
