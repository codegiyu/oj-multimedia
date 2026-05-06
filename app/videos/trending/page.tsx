import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingVideosPageClient } from '@/components/section/video/TrendingVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { TrendingVideo } from '@/components/section/video/TrendingVideos';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterByCategory } from '@/lib/utils/videos';
import { mapPublicVideoToTrendingVideo } from '@/lib/utils/publicApiMappers';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';

export const metadata: Metadata = {
  title: 'Trending Videos - Latest Content',
  description:
    "Discover what's trending now - the most popular videos everyone is watching. Stay ahead of the video content scene.",
};

async function fetchTrendingVideos(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${VIDEO_TYPES.trending}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query });
  if (res.type === 'error') {
    return {
      trendingVideos: [] as TrendingVideo[],
      initialErrorMessage: res.error?.message ?? 'Failed to load trending videos',
    };
  }

  const raw = res.data?.videos ?? [];
  const trendingVideos = filterByCategory(raw, category).map(mapPublicVideoToTrendingVideo);
  return { trendingVideos, initialErrorMessage: null as string | null };
}

interface TrendingVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingVideosPage({ searchParams }: TrendingVideosPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('video', params.category);

  return (
    <MainLayout>
      <SubPageHero
        title="Trending Videos"
        titleHighlight="Trending"
        description="Discover what's hot right now - the most popular videos everyone is watching. Stay ahead of the video content scene."
        badgeText="What's Hot"
        badgeIcon="Flame"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <TrendingVideosServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function TrendingVideosServer({ category }: { category: string }) {
  const data = await fetchTrendingVideos(category);
  return <TrendingVideosPageClient {...data} />;
}
