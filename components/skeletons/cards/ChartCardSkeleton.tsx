'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ChartCardSkeletonProps {
  className?: string;
}

export function ChartCardSkeleton({ className }: ChartCardSkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4 p-3 rounded-xl', className)}>
      <Skeleton className="w-8 h-6 shrink-0" />
      <Skeleton className="w-6 h-4 shrink-0" />
      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-4 w-12 hidden sm:block shrink-0" />
    </div>
  );
}
