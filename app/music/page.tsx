import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MusicHero } from '@/components/section/music/MusicHero';
import { MusicUploadCTA } from '@/components/section/shared/MusicUploadCTA';
import {
  MusicCategoriesSkeleton,
  TrendingSongsSectionSkeleton,
  FeaturedAlbumsSectionSkeleton,
  TopChartsSectionSkeleton,
  RecentUploadsSectionSkeleton,
  FeaturedArtistsSectionSkeleton,
} from '@/components/section/music/skeletons';
import { CHART_PERIOD_VALUES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { MusicCategoriesSection } from './_sections/MusicCategoriesSection';
import { TrendingSongsSection } from './_sections/TrendingSongsSection';
import { FeaturedAlbumsSection } from './_sections/FeaturedAlbumsSection';
import { TopChartsSection } from './_sections/TopChartsSection';
import { RecentUploadsSection } from './_sections/RecentUploadsSection';
import { FeaturedArtistsSection } from './_sections/FeaturedArtistsSection';

export const metadata: Metadata = {
  title: 'Music - Latest Songs & Downloads',
  description:
    'Discover the latest music across multiple categories, download MP3s, watch music videos, explore artist profiles, and check out top charts and download metrics.',
};

interface MusicPageProps {
  searchParams: Promise<{ category?: string; period?: string }>;
}

export default async function MusicPage({ searchParams }: MusicPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('music', params.category);
  const period = CHART_PERIOD_VALUES.includes(
    (params.period ?? 'weekly') as (typeof CHART_PERIOD_VALUES)[number]
  )
    ? (params.period ?? 'weekly')
    : 'weekly';

  return (
    <MainLayout>
      <MusicHero />
      <Suspense fallback={<MusicCategoriesSkeleton />}>
        <MusicCategoriesSection />
      </Suspense>
      <Suspense fallback={<TrendingSongsSectionSkeleton />}>
        <TrendingSongsSection category={category} />
      </Suspense>
      <Suspense fallback={<FeaturedAlbumsSectionSkeleton />}>
        <FeaturedAlbumsSection />
      </Suspense>
      <Suspense fallback={<TopChartsSectionSkeleton />}>
        <TopChartsSection category={category} period={period} />
      </Suspense>
      <Suspense fallback={<RecentUploadsSectionSkeleton />}>
        <RecentUploadsSection category={category} />
      </Suspense>
      <Suspense fallback={<FeaturedArtistsSectionSkeleton />}>
        <FeaturedArtistsSection />
      </Suspense>
      <MusicUploadCTA />
    </MainLayout>
  );
}
