import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { VideoNewsPageClient } from '@/components/section/news';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IPublicNewsListRes } from '@/lib/constants/endpoints';
import { mapPublicNewsToVideoNewsItem } from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Video Stories - News & Lifestyle Updates',
  description:
    'Watch video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more.',
};

export const dynamic = 'force-dynamic';

async function fetchVideoNews(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query = `?limit=50&page=1&status=published&type=video${categoryParam}` as const;
  const res = await callServerApi('PUBLIC_GET_NEWS', { query });

  if (res.error) {
    return {
      videoNews: [] as VideoNewsItem[],
      initialErrorMessage:
        (res.error as ApiErrorResponse)?.message ?? 'Failed to load video stories',
    };
  }

  const data = res.data as IPublicNewsListRes | undefined;
  const raw = data?.articles ?? [];
  const videoNews = filterByCategory(raw.map(mapPublicNewsToVideoNewsItem), category);
  return { videoNews, initialErrorMessage: null as string | null };
}

interface VideoNewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideoNewsPage({ searchParams }: VideoNewsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

  return (
    <MainLayout>
      <SubPageHero
        title="Video Stories"
        titleHighlight="Video"
        description="Watch engaging video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more. Visual stories that bring content to life."
        badgeText="Watch & Learn"
        badgeIcon="Play"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Play', text: 'Video content' }, { text: 'Multiple categories' }]}
      />
      <Suspense fallback={<NewsPageSkeleton />}>
        <VideoNewsServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function VideoNewsServer({ category }: { category: string }) {
  const data = await fetchVideoNews(category);
  return <VideoNewsPageClient {...data} />;
}
