'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface VideoCardSkeletonProps {
  bodyPadding?: string;
  className?: string;
}

export function VideoCardSkeleton({ bodyPadding = 'p-4', className }: VideoCardSkeletonProps) {
  return (
    <div className={cn('bg-card rounded-2xl overflow-hidden shadow-sm', className)}>
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className={bodyPadding}>
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-5 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
