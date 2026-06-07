import { HomeNewsTabsClient } from '@/components/section/home/HomeNewsTabsClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { fetchPublicNewsArticles } from '@/app/news/_sections/shared';
import type { NewsArticle } from '@/components/section/home/NewsSection';
import { HOME_ISR, mapArticleToNewsCard } from './shared';

async function fetchNewsByType(type: 'featured' | 'trending' | 'latest'): Promise<{
  articles: NewsArticle[];
  error: string | null;
}> {
  const { articles, error } = await fetchPublicNewsArticles({
    category: 'all',
    limit: 6,
    page: 1,
    type,
    fetchOptions: HOME_ISR,
  });

  return {
    articles: articles.map(mapArticleToNewsCard),
    error,
  };
}

export async function HomeNewsSection() {
  const [featuredRes, trendingRes, latestRes] = await Promise.all([
    fetchNewsByType('featured'),
    fetchNewsByType('trending'),
    fetchNewsByType('latest'),
  ]);

  const errors = [featuredRes.error, trendingRes.error, latestRes.error].filter(Boolean);

  const allEmpty =
    featuredRes.articles.length === 0 &&
    trendingRes.articles.length === 0 &&
    latestRes.articles.length === 0;

  if (allEmpty && errors.length > 0) {
    return (
      <SectionLoadError title="News unavailable" message={errors[0] ?? 'Failed to load news'} />
    );
  }

  const defaultTab =
    featuredRes.articles.length > 0
      ? 'featured'
      : latestRes.articles.length > 0
        ? 'latest'
        : trendingRes.articles.length > 0
          ? 'trending'
          : 'latest';

  return (
    <HomeNewsTabsClient
      featured={featuredRes.articles}
      trending={trendingRes.articles}
      latest={latestRes.articles}
      defaultTab={defaultTab}
    />
  );
}
