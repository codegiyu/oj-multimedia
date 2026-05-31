'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function ActivePollsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}

export function ClosedPollsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}
