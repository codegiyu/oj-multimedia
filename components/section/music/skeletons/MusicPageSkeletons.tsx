'use client';

import { PageSkeletonShell } from '@/components/skeletons';
import {
  MusicCategoriesSkeleton,
  TrendingSongsSectionSkeleton,
  FeaturedAlbumsSectionSkeleton,
  TopChartsSectionSkeleton,
  RecentUploadsSectionSkeleton,
  FeaturedArtistsSectionSkeleton,
  MusicUploadCTASkeleton,
  MusicTrendingGridSectionSkeleton,
  MusicAlbumsGridSkeleton,
} from './MusicSectionSkeletons';

export function MusicHubPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading music page">
      <MusicCategoriesSkeleton />
      <TrendingSongsSectionSkeleton />
      <FeaturedAlbumsSectionSkeleton />
      <TopChartsSectionSkeleton />
      <RecentUploadsSectionSkeleton />
      <FeaturedArtistsSectionSkeleton />
      <MusicUploadCTASkeleton />
    </PageSkeletonShell>
  );
}

export function MusicTrendingPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading trending songs">
      <MusicCategoriesSkeleton />
      <MusicTrendingGridSectionSkeleton />
      <MusicUploadCTASkeleton />
    </PageSkeletonShell>
  );
}

export function MusicTopChartsPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading top charts">
      <MusicCategoriesSkeleton />
      <TopChartsSectionSkeleton showFooterButton={false} />
      <MusicUploadCTASkeleton />
    </PageSkeletonShell>
  );
}

export function MusicAlbumsPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading albums">
      <MusicAlbumsGridSkeleton />
    </PageSkeletonShell>
  );
}

/** @deprecated Use MusicHubPageSkeleton */
export const MusicPageSkeleton = MusicHubPageSkeleton;
