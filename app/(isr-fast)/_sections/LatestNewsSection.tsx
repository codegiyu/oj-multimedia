import { NewsSection } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicNewsListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR, mapArticleToNewsCard } from './shared';

export async function LatestNewsSection() {
  const query = new URLSearchParams({
    limit: '6',
    page: '1',
    status: 'published',
    type: 'latest',
  });

  const res = await callPublicServerApi(
    'PUBLIC_GET_NEWS',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Latest news unavailable"
        message={res.error?.message ?? 'Failed to load latest news'}
      />
    );
  }

  const articles = ((res.data as IPublicNewsListRes | undefined)?.articles ?? []).map(
    mapArticleToNewsCard
  );

  return <NewsSection articles={articles} />;
}
