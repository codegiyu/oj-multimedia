import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingStoriesPageClient } from '@/components/section/news';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapPublicNewsToTrendingStory } from '@/lib/utils/publicApiMappers';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { newsCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';

export const metadata: Metadata = {
  title: 'Trending Stories - News & Lifestyle Updates',
  description:
    "Discover what's trending now - the most popular stories, topics, and discussions everyone is talking about.",
};

async function fetchTrendingStories(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${NEWS_TYPES.trending}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, ISR_PUBLIC_FETCH.fast);

  if (res.type === 'error') {
    return {
      trendingStories: [] as TrendingStory[],
      initialErrorMessage: res.error?.message ?? 'Failed to load trending stories',
    };
  }

  const raw = res.data?.articles ?? [];
  const trendingStories = raw.map((item, i) => mapPublicNewsToTrendingStory(item, i + 1));
  return { trendingStories, initialErrorMessage: null as string | null };
}

interface TrendingStoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingStoriesPage({ searchParams }: TrendingStoriesPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope(
    'news',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );

  return (
    <MainLayout>
      <SubPageHero
        title="Trending Stories"
        titleHighlight="Trending"
        description="Discover what's hot right now - the most popular stories, topics, and discussions everyone is talking about. Stay ahead of the conversation."
        badgeText="What's Hot"
        badgeIcon="TrendingUp"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }]}
      />
      <Suspense fallback={<NewsPageSkeleton />}>
        <TrendingStoriesServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function TrendingStoriesServer({ category }: { category: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchTrendingStories(category),
    fetchPublicCategoryNav('news', 'All Stories', newsCategoryNavFallback, ISR_PUBLIC_FETCH.fast),
  ]);

  return <TrendingStoriesPageClient {...data} categoryOptions={categoryOptions} />;
}
