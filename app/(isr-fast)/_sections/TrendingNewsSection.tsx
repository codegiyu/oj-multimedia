import { NewsSection } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicNewsListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR, mapArticleToNewsCard } from './shared';

export async function TrendingNewsSection() {
  const query = new URLSearchParams({
    limit: '6',
    page: '1',
    status: 'published',
    type: 'trending',
  });

  const res = await callPublicServerApi(
    'PUBLIC_GET_NEWS',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending news unavailable"
        message={res.error?.message ?? 'Failed to load trending news'}
      />
    );
  }

  const articles = ((res.data as IPublicNewsListRes | undefined)?.articles ?? []).map(
    mapArticleToNewsCard
  );

  if (articles.length === 0) return null;

  return (
    <NewsSection
      articles={articles}
      heading="Trending news"
      subtext="What readers engage with most"
      viewAllLink="/news/trending"
      sectionId="news-trending"
    />
  );
}
