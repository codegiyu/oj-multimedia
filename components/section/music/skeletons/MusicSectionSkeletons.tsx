'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  SectionSkeleton,
  SectionHeaderSkeleton,
  CategoryPillRowSkeleton,
  HorizontalRailSkeleton,
  CardGridSkeleton,
  CTASectionSkeleton,
  MusicCardSkeleton,
  AlbumCardSkeleton,
  ChartCardSkeleton,
  ArtistCardSkeleton,
} from '@/components/skeletons';
import { MEDIA_BROWSE_GRID_CLASS, MUSIC_RAIL_ITEM_CLASS } from '@/lib/constants/mediaCardLayout';

export function MusicCategoriesSkeleton() {
  return <CategoryPillRowSkeleton count={10} sticky={false} />;
}

export function TrendingSongsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton showPrevNext showViewAll />
      <HorizontalRailSkeleton itemWidthClass={MUSIC_RAIL_ITEM_CLASS} count={8}>
        <MusicCardSkeleton />
      </HorizontalRailSkeleton>
    </SectionSkeleton>
  );
}

export function FeaturedAlbumsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton showPrevNext showViewAll />
      <HorizontalRailSkeleton itemWidthClass="min-w-[260px] max-w-[260px]" count={6}>
        <MusicCardSkeleton />
      </HorizontalRailSkeleton>
    </SectionSkeleton>
  );
}

export function TopChartsSectionSkeleton({
  showFooterButton = true,
}: {
  showFooterButton?: boolean;
}) {
  return (
    <SectionSkeleton background="bg-muted/30" sectionClassName="overflow-hidden">
      <SectionHeaderSkeleton
        showViewAll={false}
        extraActions={
          <>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </>
        }
      />
      <CardGridSkeleton count={10} gridClassName="grid md:grid-cols-2 gap-4">
        <ChartCardSkeleton />
      </CardGridSkeleton>
      {showFooterButton ? (
        <div className="text-center mt-8">
          <Skeleton className="h-11 w-40 rounded-md mx-auto" />
        </div>
      ) : null}
    </SectionSkeleton>
  );
}

export function RecentUploadsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <CardGridSkeleton count={6} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
        <MusicCardSkeleton />
      </CardGridSkeleton>
    </SectionSkeleton>
  );
}

export function FeaturedArtistsSectionSkeleton() {
  return (
    <SectionSkeleton background="bg-muted/30">
      <SectionHeaderSkeleton />
      <CardGridSkeleton
        count={6}
        gridClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <ArtistCardSkeleton />
      </CardGridSkeleton>
    </SectionSkeleton>
  );
}

export function MusicUploadCTASkeleton() {
  return <CTASectionSkeleton />;
}

export function ArtistsSpotlightGridSkeleton() {
  return (
    <SectionSkeleton>
      <CardGridSkeleton
        count={12}
        gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <Skeleton className="aspect-square w-full rounded-xl" />
      </CardGridSkeleton>
      <div className="flex justify-center mt-10">
        <Skeleton className="h-12 w-44 rounded-full" />
      </div>
    </SectionSkeleton>
  );
}

export function MusicTrendingGridSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <CardGridSkeleton count={8} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
        <MusicCardSkeleton />
      </CardGridSkeleton>
      <div className="flex justify-center mt-10">
        <Skeleton className="h-12 w-44 rounded-full" />
      </div>
    </SectionSkeleton>
  );
}

export function MusicAlbumsGridSkeleton() {
  return (
    <section className="w-full section-padding">
      <div className="regular-container">
        <CardGridSkeleton
          count={15}
          gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AlbumCardSkeleton />
        </CardGridSkeleton>
      </div>
    </section>
  );
}
