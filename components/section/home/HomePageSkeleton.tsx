'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  PageSkeletonShell,
  SectionSkeleton,
  SectionHeaderSkeleton,
  HorizontalRailSkeleton,
  CardGridSkeleton,
  CTASectionSkeleton,
  MusicCardSkeleton,
  VideoCardSkeleton,
  ChartCardSkeleton,
  ArtistCardSkeleton,
  ProductCardSkeleton,
  DevotionalCardSkeleton,
  HomeAdvertStripSkeleton,
  SimpleMusicRailSkeleton,
  SimpleVideoRailSkeleton,
} from '@/components/skeletons';
import {
  MUSIC_RAIL_ITEM_CLASS,
  VIDEO_DEFAULT_RAIL_ITEM_CLASS,
} from '@/lib/constants/mediaCardLayout';

export function TrendingMusicSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton showPrevNext tabs={7} />
      <HorizontalRailSkeleton itemWidthClass={MUSIC_RAIL_ITEM_CLASS} count={8}>
        <MusicCardSkeleton />
      </HorizontalRailSkeleton>
    </SectionSkeleton>
  );
}

export function TrendingVideosSectionSkeleton() {
  return (
    <SectionSkeleton background="bg-muted/30">
      <SectionHeaderSkeleton showPrevNext tabs={6} />
      <HorizontalRailSkeleton itemWidthClass={VIDEO_DEFAULT_RAIL_ITEM_CLASS} count={6}>
        <VideoCardSkeleton />
      </HorizontalRailSkeleton>
    </SectionSkeleton>
  );
}

export function DevotionalsRailSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <HorizontalRailSkeleton itemWidthClass="w-[260px] sm:w-[280px]" count={5}>
        <DevotionalCardSkeleton />
      </HorizontalRailSkeleton>
    </SectionSkeleton>
  );
}

export function ChartsColumnSkeleton() {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm">
      <SectionHeaderSkeleton showViewAll className="mb-6" />
      <div className="space-y-1">
        {Array.from({ length: 5 }, (_, i) => (
          <ChartCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function RisingArtistsColumnSkeleton() {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm">
      <SectionHeaderSkeleton showViewAll className="mb-6" />
      <CardGridSkeleton count={4} gridClassName="grid grid-cols-2 gap-4">
        <ArtistCardSkeleton />
      </CardGridSkeleton>
    </div>
  );
}

export function TopChartsSectionSkeleton() {
  return (
    <SectionSkeleton sectionClassName="overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartsColumnSkeleton />
        <RisingArtistsColumnSkeleton />
      </div>
    </SectionSkeleton>
  );
}

export function NewsSectionSkeleton() {
  return (
    <SectionSkeleton background="bg-muted/30">
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
  );
}

export function MarketplaceSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <CardGridSkeleton count={4} gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <ProductCardSkeleton />
      </CardGridSkeleton>
    </SectionSkeleton>
  );
}

export function CommunityHighlightsSkeleton() {
  return (
    <div className="lg:col-span-2 space-y-4">
      <Skeleton className="h-6 w-40" />
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-card rounded-2xl p-4">
          <div className="flex gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PollSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-3 w-24 mt-3" />
      </div>
      <div className="bg-card rounded-2xl p-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommunitySectionSkeleton() {
  return (
    <SectionSkeleton background="bg-muted/30">
      <SectionHeaderSkeleton />
      <div className="grid lg:grid-cols-3 gap-6">
        <CommunityHighlightsSkeleton />
        <PollSectionSkeleton />
      </div>
    </SectionSkeleton>
  );
}

export const HomePageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading home page">
      <HomeAdvertStripSkeleton />
      <SimpleMusicRailSkeleton />
      <SimpleMusicRailSkeleton />
      <TrendingMusicSectionSkeleton />
      <TrendingVideosSectionSkeleton />
      <SimpleVideoRailSkeleton />
      <DevotionalsRailSkeleton />
      <TopChartsSectionSkeleton />
      <NewsSectionSkeleton />
      <NewsSectionSkeleton />
      <NewsSectionSkeleton />
      <MarketplaceSectionSkeleton />
      <CommunitySectionSkeleton />
      <HomeAdvertStripSkeleton />
      <CTASectionSkeleton />
    </PageSkeletonShell>
  );
};
