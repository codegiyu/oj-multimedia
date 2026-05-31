import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { VideoNewsPageClient } from '@/components/section/news';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicNewsToVideoNewsItem } from '@/lib/utils/publicApiMappers';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { newsCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';

export const metadata: Metadata = {
  title: 'Video Stories - News & Lifestyle Updates',
  description:
    'Watch video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more.',
};

async function fetchVideoNews(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${NEWS_TYPES.video}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query });

  if (res.type === 'error') {
    return {
      videoNews: [] as VideoNewsItem[],
      initialErrorMessage: res.error?.message ?? 'Failed to load video stories',
    };
  }

  const raw = res.data?.articles ?? [];
  const videoNews = raw.map(mapPublicNewsToVideoNewsItem);
  return { videoNews, initialErrorMessage: null as string | null };
}

interface VideoNewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideoNewsPage({ searchParams }: VideoNewsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('news', params.category);

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
  const [data, categoryOptions] = await Promise.all([
    fetchVideoNews(category),
    fetchPublicCategoryNav('news', 'All Stories', newsCategoryNavFallback),
  ]);

  return <VideoNewsPageClient {...data} categoryOptions={categoryOptions} />;
}
