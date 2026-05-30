'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  PageSkeletonShell,
  SectionSkeleton,
  SectionHeaderSkeleton,
  CategoryPillRowSkeleton,
  CardGridSkeleton,
  CTASectionSkeleton,
  VideoCardSkeleton,
} from '@/components/skeletons';

export const NewsPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading news page">
      <CategoryPillRowSkeleton count={8} sticky />

      <SectionSkeleton>
        <SectionHeaderSkeleton />
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-2xl" />
          <div className="grid gap-6">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-4 bg-card rounded-2xl p-4">
                <Skeleton className="w-[140px] aspect-video rounded-xl shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-20 mb-2 rounded-full" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="w-full md:w-1/3 h-48 md:h-auto aspect-video md:aspect-auto rounded-none" />
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="bg-card rounded-2xl p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionSkeleton>

      <SectionSkeleton background="bg-muted/30">
        <SectionHeaderSkeleton />
        <CardGridSkeleton count={4} gridClassName="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <VideoCardSkeleton bodyPadding="p-4" />
        </CardGridSkeleton>
      </SectionSkeleton>

      <CTASectionSkeleton />
    </PageSkeletonShell>
  );
};
