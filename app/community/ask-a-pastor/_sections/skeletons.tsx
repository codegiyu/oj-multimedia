'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function ActiveQuestionsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}

export function AskAPastorHubSupplementSectionSkeleton() {
  return (
    <>
      <SectionSkeleton>
        <SectionHeaderSkeleton showViewAll={false} />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
      </SectionSkeleton>
      <SectionSkeleton>
        <SectionHeaderSkeleton />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </SectionSkeleton>
      <SectionSkeleton>
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </SectionSkeleton>
    </>
  );
}
