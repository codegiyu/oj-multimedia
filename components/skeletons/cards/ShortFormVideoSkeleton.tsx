'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ShortFormVideoSkeletonProps {
  className?: string;
}

export function ShortFormVideoSkeleton({ className }: ShortFormVideoSkeletonProps) {
  return (
    <div className={cn('w-[140px] md:w-[160px] shrink-0', className)}>
      <div className="bg-card rounded-2xl overflow-hidden">
        <Skeleton className="aspect-[9/16] w-full rounded-none" />
        <div className="p-3">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}
