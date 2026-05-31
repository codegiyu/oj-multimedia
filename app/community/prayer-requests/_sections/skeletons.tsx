'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function ActivePrayerRequestsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}

export function PrayerHubSupplementSectionSkeleton() {
  return (
    <>
      <SectionSkeleton>
        <SectionHeaderSkeleton />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </SectionSkeleton>
      <SectionSkeleton>
        <SectionHeaderSkeleton showViewAll={false} />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </SectionSkeleton>
    </>
  );
}
