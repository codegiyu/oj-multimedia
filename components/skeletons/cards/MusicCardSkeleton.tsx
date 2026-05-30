'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface MusicCardSkeletonProps {
  bodyPadding?: string;
  className?: string;
}

export function MusicCardSkeleton({ bodyPadding = 'p-4', className }: MusicCardSkeletonProps) {
  return (
    <div className={cn('bg-card rounded-2xl overflow-hidden shadow-sm', className)}>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className={bodyPadding}>
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
