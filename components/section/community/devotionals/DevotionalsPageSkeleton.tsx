'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell, SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function DevotionalsCategoryFilterSkeleton() {
  return <Skeleton className="mb-6 h-10 w-full max-w-xs rounded-md" />;
}

export function DevotionalsBrowseSkeleton() {
  return (
    <SectionSkeleton>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
            <Skeleton className="aspect-[1.75] w-full rounded-none" />
            <div className="p-5">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

export const DevotionalsPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading devotionals">
      <SectionSkeleton sectionClassName="pb-0">
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 border border-border/50">
              <Skeleton className="h-16 w-16 rounded-xl mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </SectionSkeleton>

      <DevotionalsBrowseSkeleton />
    </PageSkeletonShell>
  );
};
