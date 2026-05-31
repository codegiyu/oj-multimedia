import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsHero } from '@/components/section/news/NewsHero';
import { NewsPageClient } from '@/components/section/news/NewsPageClient';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import type { FeaturedStory } from '@/components/section/news/FeaturedStories';
import type { NewsItem as NewsFeedItem } from '@/components/section/news/NewsFeed';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';
import type { BreakingNewsStory } from '@/components/section/news/BreakingNews';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { newsCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import {
  filterPublicNewsList,
  mapPublicNewsToFeaturedStory,
  mapPublicNewsToFeedItem,
  mapPublicNewsToTrendingStory,
  mapPublicNewsToVideoNewsItem,
  mapPublicNewsToBreakingStory,
} from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'News & Lifestyle Updates',
  description:
    'Stay updated with the latest news, announcements, inspirational stories, lifestyle content, and trending topics. Explore recent updates and popular stories.',
};

async function fetchNewsSections(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const baseQuery = `?limit=15&page=1&status=published${categoryParam}` as const;

  const [featuredRes, latestRes, trendingRes, videoRes, breakingRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.featured}` }),
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.latest}` }),
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.trending}` }),
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.video}` }),
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.breaking}` }),
  ]);

  let errorMessage: string | null = null;
  if (featuredRes.type === 'error')
    errorMessage = featuredRes.error?.message ?? 'Failed to load news';
  else if (latestRes.type === 'error')
    errorMessage = latestRes.error?.message ?? 'Failed to load latest';
  else if (trendingRes.type === 'error')
    errorMessage = trendingRes.error?.message ?? 'Failed to load trending';
  else if (videoRes.type === 'error')
    errorMessage = videoRes.error?.message ?? 'Failed to load video stories';
  else if (breakingRes.type === 'error')
    errorMessage = breakingRes.error?.message ?? 'Failed to load breaking news';

  const rawFeatured = filterPublicNewsList(
    featuredRes.type === 'success' ? (featuredRes.data?.articles ?? []) : []
  );
  const rawLatest = filterPublicNewsList(
    latestRes.type === 'success' ? (latestRes.data?.articles ?? []) : []
  );
  const rawTrending = filterPublicNewsList(
    trendingRes.type === 'success' ? (trendingRes.data?.articles ?? []) : []
  );
  const rawVideo = filterPublicNewsList(
    videoRes.type === 'success' ? (videoRes.data?.articles ?? []) : []
  );
  const rawBreaking = filterPublicNewsList(
    breakingRes.type === 'success' ? (breakingRes.data?.articles ?? []) : []
  );

  const featuredStories: FeaturedStory[] = rawFeatured
    .map(mapPublicNewsToFeaturedStory)
    .slice(0, 3);
  const newsItems: NewsFeedItem[] = rawLatest.map(mapPublicNewsToFeedItem).slice(0, 10);
  const trendingStories: TrendingStory[] = rawTrending
    .map((item, i) => mapPublicNewsToTrendingStory(item, i + 1))
    .slice(0, 6);
  const videoNews: VideoNewsItem[] = rawVideo.map(mapPublicNewsToVideoNewsItem).slice(0, 4);
  const breakingStories: BreakingNewsStory[] = rawBreaking
    .map(mapPublicNewsToBreakingStory)
    .slice(0, 8);

  return {
    featuredStories,
    newsItems,
    trendingStories,
    videoNews,
    breakingStories,
    initialErrorMessage: errorMessage,
  };
}

interface NewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('news', params.category);

  return (
    <MainLayout>
      <NewsHero />
      <Suspense fallback={<NewsPageSkeleton />}>
        <NewsPageServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function NewsPageServer({ category }: { category: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchNewsSections(category),
    fetchPublicCategoryNav('news', 'All Stories', newsCategoryNavFallback),
  ]);

  return <NewsPageClient {...data} categoryOptions={categoryOptions} />;
}
