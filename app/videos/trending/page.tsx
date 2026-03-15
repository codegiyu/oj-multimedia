import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingVideosPageClient } from '@/components/section/video/TrendingVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { TrendingVideo } from '@/components/section/video/TrendingVideos';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IPublicVideosListRes } from '@/lib/constants/endpoints';
import { filterByCategory } from '@/lib/utils/videos';
import { mapPublicVideoToTrendingVideo } from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Trending Videos - Latest Content',
  description:
    "Discover what's trending now - the most popular videos everyone is watching. Stay ahead of the video content scene.",
};

export const dynamic = 'force-dynamic';

async function fetchTrendingVideos(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query = `?limit=50&page=1&status=published&type=trending${categoryParam}` as const;
  const res = await callServerApi('PUBLIC_GET_VIDEOS', { query });
  if (res.error) {
    return {
      trendingVideos: [] as TrendingVideo[],
      initialErrorMessage:
        (res.error as ApiErrorResponse)?.message ?? 'Failed to load trending videos',
    };
  }
  const data = res.data as IPublicVideosListRes | undefined;
  const raw = data?.videos ?? [];
  const trendingVideos = filterByCategory(raw, category).map(mapPublicVideoToTrendingVideo);
  return { trendingVideos, initialErrorMessage: null as string | null };
}

interface TrendingVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingVideosPage({ searchParams }: TrendingVideosPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

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
