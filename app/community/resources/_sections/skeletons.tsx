'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function ResourceDownloadCategoriesSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}

export function ResourceTypeSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}
