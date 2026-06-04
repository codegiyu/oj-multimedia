import { HomeNewsTabsClient } from '@/components/section/home/HomeNewsTabsClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicNewsListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { NewsArticle } from '@/components/section/home/NewsSection';
import { HOME_ISR, mapArticleToNewsCard } from './shared';

async function fetchNewsByType(type: 'featured' | 'trending' | 'latest'): Promise<{
  articles: NewsArticle[];
  error: string | null;
}> {
  const query = new URLSearchParams({
    limit: '6',
    page: '1',
    status: 'published',
    type,
  });

  const res = await callPublicServerApi(
    'PUBLIC_GET_NEWS',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return {
      articles: [],
      error: res.error?.message ?? `Failed to load ${type} news`,
    };
  }

  const articles = ((res.data as IPublicNewsListRes | undefined)?.articles ?? []).map(
    mapArticleToNewsCard
  );

  return { articles, error: null };
}

export async function HomeNewsSection() {
  const [featuredRes, trendingRes, latestRes] = await Promise.all([
    fetchNewsByType('featured'),
    fetchNewsByType('trending'),
    fetchNewsByType('latest'),
  ]);

  const errors = [featuredRes.error, trendingRes.error, latestRes.error].filter(Boolean);

  if (
    featuredRes.articles.length === 0 &&
    trendingRes.articles.length === 0 &&
    latestRes.articles.length === 0
  ) {
    if (errors.length > 0) {
      return (
        <SectionLoadError title="News unavailable" message={errors[0] ?? 'Failed to load news'} />
      );
    }

    return null;
  }

  return (
    <HomeNewsTabsClient
      featured={featuredRes.articles}
      trending={trendingRes.articles}
      latest={latestRes.articles}
    />
  );
}
