'use client';

import {
  PageSkeletonShell,
  SectionSkeleton,
  SectionHeaderSkeleton,
  CategoryPillRowSkeleton,
  HorizontalRailSkeleton,
  CardGridSkeleton,
  CTASectionSkeleton,
  VideoCardSkeleton,
  ShortFormVideoSkeleton,
} from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export const VideoPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading videos page">
      <CategoryPillRowSkeleton count={8} sticky={false} />

      <SectionSkeleton>
        <SectionHeaderSkeleton showPrevNext />
        <HorizontalRailSkeleton itemWidthClass="w-[280px] md:w-[320px]" count={8}>
          <VideoCardSkeleton />
        </HorizontalRailSkeleton>
      </SectionSkeleton>

      <SectionSkeleton background="bg-muted/30">
        <SectionHeaderSkeleton />
        <CardGridSkeleton count={4} gridClassName="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <VideoCardSkeleton />
        </CardGridSkeleton>
      </SectionSkeleton>

      <SectionSkeleton>
        <SectionHeaderSkeleton />
        <CardGridSkeleton count={6} gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex gap-4 p-4 bg-card rounded-2xl">
            <Skeleton className="w-32 h-20 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </CardGridSkeleton>
      </SectionSkeleton>

      <SectionSkeleton background="bg-muted/30">
        <SectionHeaderSkeleton />
        <div className="flex gap-3 overflow-x-auto pb-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ShortFormVideoSkeleton key={i} />
          ))}
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <SectionHeaderSkeleton />
        <CardGridSkeleton count={6} gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl overflow-hidden">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32 mb-2" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-border/50">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-9 w-full mt-3 rounded-lg" />
            </div>
          </div>
        </CardGridSkeleton>
      </SectionSkeleton>

      <CTASectionSkeleton />
    </PageSkeletonShell>
  );
};
