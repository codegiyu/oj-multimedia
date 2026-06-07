'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  SectionSkeleton,
  SectionHeaderSkeleton,
  CategoryPillRowSkeleton,
  HorizontalRailSkeleton,
  CardGridSkeleton,
  CTASectionSkeleton,
  VideoCardSkeleton,
} from '@/components/skeletons';
import {
  MEDIA_BROWSE_GRID_CLASS,
  VIDEO_DEFAULT_RAIL_ITEM_CLASS,
} from '@/lib/constants/mediaCardLayout';

export function VideoCategoriesSkeleton() {
  return <CategoryPillRowSkeleton count={8} sticky={false} />;
}

export function TrendingVideosSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton showPrevNext />
      <HorizontalRailSkeleton itemWidthClass={VIDEO_DEFAULT_RAIL_ITEM_CLASS} count={8}>
        <VideoCardSkeleton />
      </HorizontalRailSkeleton>
    </SectionSkeleton>
  );
}

export function FeaturedVideosSectionSkeleton() {
  return (
    <SectionSkeleton background="bg-muted/30">
      <SectionHeaderSkeleton />
      <CardGridSkeleton count={4} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
        <VideoCardSkeleton />
      </CardGridSkeleton>
    </SectionSkeleton>
  );
}

export function RecentUploadsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <CardGridSkeleton count={6} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
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
  );
}

export function ShortFormVideosSectionSkeleton() {
  return (
    <SectionSkeleton background="bg-muted/30">
      <SectionHeaderSkeleton showPrevNext />
      <HorizontalRailSkeleton itemWidthClass={VIDEO_DEFAULT_RAIL_ITEM_CLASS} count={8}>
        <VideoCardSkeleton />
      </HorizontalRailSkeleton>
    </SectionSkeleton>
  );
}

export function LongFormVideosSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <CardGridSkeleton count={4} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
        <VideoCardSkeleton />
      </CardGridSkeleton>
    </SectionSkeleton>
  );
}

export function CreatorSpotlightSectionSkeleton() {
  return (
    <SectionSkeleton background="bg-muted/30">
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
            <Skeleton className="h-9 w-full mt-3 rounded-lg" />
          </div>
        </div>
      </CardGridSkeleton>
    </SectionSkeleton>
  );
}

export function VideoSubpageGridSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton showPrevNext />
      <CardGridSkeleton count={8} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
        <VideoCardSkeleton />
      </CardGridSkeleton>
    </SectionSkeleton>
  );
}

export function VideosHubDynamicSectionsSkeleton() {
  return (
    <>
      <VideoCategoriesSkeleton />
      <TrendingVideosSectionSkeleton />
      <FeaturedVideosSectionSkeleton />
      <RecentUploadsSectionSkeleton />
      <ShortFormVideosSectionSkeleton />
      <LongFormVideosSectionSkeleton />
      <CreatorSpotlightSectionSkeleton />
    </>
  );
}

export function VideosHubPageSkeleton() {
  return (
    <>
      <VideosHubDynamicSectionsSkeleton />
      <CTASectionSkeleton />
    </>
  );
}
