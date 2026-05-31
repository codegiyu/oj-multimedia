'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { VIDEO_SHORT_FORM_RAIL_ITEM_CLASS } from '@/lib/constants/mediaCardLayout';

export interface ShortFormVideoSkeletonProps {
  className?: string;
}

export function ShortFormVideoSkeleton({ className }: ShortFormVideoSkeletonProps) {
  return (
    <div className={cn(VIDEO_SHORT_FORM_RAIL_ITEM_CLASS, className)}>
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
