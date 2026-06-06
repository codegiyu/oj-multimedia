'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell, SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function AskAPastorBrowseSkeleton() {
  return (
    <SectionSkeleton sectionClassName="pb-0">
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

export const AskAPastorPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading ask a pastor">
      <SectionSkeleton sectionClassName="pb-0">
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 max-w-full mx-auto" />
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <Skeleton className="h-32 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </SectionSkeleton>
    </PageSkeletonShell>
  );
};
