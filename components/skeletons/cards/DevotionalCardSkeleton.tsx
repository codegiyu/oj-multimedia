'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface DevotionalCardSkeletonProps {
  className?: string;
}

export function DevotionalCardSkeleton({ className }: DevotionalCardSkeletonProps) {
  return (
    <div className={cn('rounded-2xl border border-border/60 bg-card overflow-hidden', className)}>
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
