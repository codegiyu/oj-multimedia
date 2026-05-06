import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsHero } from '@/components/section/news/NewsHero';
import { NewsPageClient } from '@/components/section/news/NewsPageClient';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import type { FeaturedStory } from '@/components/section/news/FeaturedStories';
import type { NewsItem as NewsFeedItem } from '@/components/section/news/NewsFeed';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import {
  mapPublicNewsToFeaturedStory,
  mapPublicNewsToFeedItem,
  mapPublicNewsToTrendingStory,
  mapPublicNewsToVideoNewsItem,
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

  const [featuredRes, latestRes, trendingRes, videoRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.featured}` }),
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.latest}` }),
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.trending}` }),
    callPublicServerApi('PUBLIC_GET_NEWS', { query: `${baseQuery}&type=${NEWS_TYPES.video}` }),
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

  const rawFeatured = featuredRes.type === 'success' ? (featuredRes.data?.articles ?? []) : [];
  const rawLatest = latestRes.type === 'success' ? (latestRes.data?.articles ?? []) : [];
  const rawTrending = trendingRes.type === 'success' ? (trendingRes.data?.articles ?? []) : [];
  const rawVideo = videoRes.type === 'success' ? (videoRes.data?.articles ?? []) : [];

  const featuredStories: FeaturedStory[] = filterByCategory(
    rawFeatured.map(mapPublicNewsToFeaturedStory),
    category
  ).slice(0, 3);
  const newsItems: NewsFeedItem[] = filterByCategory(
    rawLatest.map(mapPublicNewsToFeedItem),
    category
  ).slice(0, 10);
  const trendingStories: TrendingStory[] = filterByCategory(
    rawTrending.map((item, i) => mapPublicNewsToTrendingStory(item, i + 1)),
    category
  ).slice(0, 6);
  const videoNews: VideoNewsItem[] = filterByCategory(
    rawVideo.map(mapPublicNewsToVideoNewsItem),
    category
  ).slice(0, 4);

  return {
    featuredStories,
    newsItems,
    trendingStories,
    videoNews,
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
  const data = await fetchNewsSections(category);
  return <NewsPageClient {...data} />;
}
