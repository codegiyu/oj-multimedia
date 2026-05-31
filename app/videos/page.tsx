import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoHero } from '@/components/section/video/VideoHero';
import { VideoUploadCTA } from '@/components/section/video/VideoUploadCTA';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { VideoCategoriesSection } from './_sections/VideoCategoriesSection';
import { TrendingVideosSection } from './_sections/TrendingVideosSection';
import { FeaturedVideosSection } from './_sections/FeaturedVideosSection';
import { RecentUploadsSection } from './_sections/RecentUploadsSection';
import { ShortFormVideosSection } from './_sections/ShortFormVideosSection';
import { LongFormVideosSection } from './_sections/LongFormVideosSection';
import { CreatorSpotlightSection } from './_sections/CreatorSpotlightSection';
import {
  VideoCategoriesSkeleton,
  TrendingVideosSectionSkeleton,
  FeaturedVideosSectionSkeleton,
  RecentUploadsSectionSkeleton,
  ShortFormVideosSectionSkeleton,
  LongFormVideosSectionSkeleton,
  CreatorSpotlightSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Videos - Trending & Creative Content',
  description:
    'Discover trending videos, watch creative content, explore music videos, short clips, talks, and inspirational videos from talented creators. Publishing is curated—contact us to submit videos for review.',
};

interface VideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('video', params.category);

  return (
    <MainLayout>
      <VideoHero />
      <Suspense fallback={<VideoCategoriesSkeleton />}>
        <VideoCategoriesSection category={category} />
      </Suspense>
      <Suspense fallback={<TrendingVideosSectionSkeleton />}>
        <TrendingVideosSection category={category} />
      </Suspense>
      <Suspense fallback={<FeaturedVideosSectionSkeleton />}>
        <FeaturedVideosSection category={category} />
      </Suspense>
      <Suspense fallback={<RecentUploadsSectionSkeleton />}>
        <RecentUploadsSection category={category} />
      </Suspense>
      <Suspense fallback={<ShortFormVideosSectionSkeleton />}>
        <ShortFormVideosSection category={category} />
      </Suspense>
      <Suspense fallback={<LongFormVideosSectionSkeleton />}>
        <LongFormVideosSection category={category} />
      </Suspense>
      <Suspense fallback={<CreatorSpotlightSectionSkeleton />}>
        <CreatorSpotlightSection category={category} />
      </Suspense>
      <VideoUploadCTA />
    </MainLayout>
  );
}
