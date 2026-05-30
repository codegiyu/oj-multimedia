'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell, SectionSkeleton } from '@/components/skeletons';

export const PollsPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading polls">
      <SectionSkeleton sectionClassName="pb-0">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="space-y-3 mb-6">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-40 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-full mb-4" />
              <div className="space-y-3 mb-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </SectionSkeleton>
    </PageSkeletonShell>
  );
};
