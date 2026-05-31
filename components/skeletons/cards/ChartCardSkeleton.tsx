'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ChartCardSkeletonProps {
  className?: string;
}

export function ChartCardSkeleton({ className }: ChartCardSkeletonProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-sm',
        className
      )}>
      <div className="flex w-10 shrink-0 flex-col items-center gap-1">
        <Skeleton className="h-2 w-6" />
        <Skeleton className="h-6 w-5" />
      </div>
      <div className="flex w-10 shrink-0 flex-col items-center gap-1">
        <Skeleton className="h-2 w-6" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <Skeleton className="mb-2 h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
        <Skeleton className="h-8 w-14" />
        <Skeleton className="h-6 w-10" />
      </div>
    </div>
  );
}
