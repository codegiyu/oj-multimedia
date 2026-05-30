'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ArtistCardSkeletonProps {
  className?: string;
}

export function ArtistCardSkeleton({ className }: ArtistCardSkeletonProps) {
  return (
    <div className={cn('p-4 rounded-2xl bg-muted/50 text-center', className)}>
      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
      <Skeleton className="h-4 w-20 mx-auto mb-2" />
      <Skeleton className="h-3 w-16 mx-auto mb-1" />
      <Skeleton className="h-3 w-12 mx-auto" />
    </div>
  );
}
