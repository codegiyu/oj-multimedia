import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingStoriesPageClient } from '@/components/section/news';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import { callServerApi } from '@/lib/services/serverApi';
import { mapPublicNewsToTrendingStory } from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Trending Stories - News & Lifestyle Updates',
  description:
    "Discover what's trending now - the most popular stories, topics, and discussions everyone is talking about.",
};

export const dynamic = 'force-dynamic';

async function fetchTrendingStories(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query = `?limit=50&page=1&status=published&type=trending${categoryParam}` as const;
  const res = await callServerApi('PUBLIC_GET_NEWS', { query });

  if (res.type === 'error') {
    return {
      trendingStories: [] as TrendingStory[],
      initialErrorMessage: res.error?.message ?? 'Failed to load trending stories',
    };
  }

  const raw = res.data?.articles ?? [];
  const trendingStories = filterByCategory(
    raw.map((item, i) => mapPublicNewsToTrendingStory(item, i + 1)),
    category
  );
  return { trendingStories, initialErrorMessage: null as string | null };
}

interface TrendingStoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingStoriesPage({ searchParams }: TrendingStoriesPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

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
  const data = await fetchTrendingStories(category);
  return <TrendingStoriesPageClient {...data} />;
}
