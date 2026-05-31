'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell, SectionSkeleton } from '@/components/skeletons';

export const ResourcesPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading resources">
      <SectionSkeleton sectionClassName="py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </SectionSkeleton>
    </PageSkeletonShell>
  );
};
