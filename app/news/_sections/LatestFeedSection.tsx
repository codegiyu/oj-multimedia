import { NewsFeed } from '@/components/section/news/NewsFeed';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToFeedItem } from '@/lib/utils/publicApiMappers';
import { buildNewsBaseQuery, type NewsSectionProps } from './shared';

export async function LatestFeedSection({
  category,
  limit = 15,
  fetchOptions,
  maxItems = 10,
}: NewsSectionProps & { maxItems?: number }) {
  const query = `${buildNewsBaseQuery(category, limit)}&type=${NEWS_TYPES.latest}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Latest stories unavailable"
        message={res.error?.message ?? 'Failed to load latest stories'}
      />
    );
  }

  const newsItems = (res.data?.articles ?? []).map(mapPublicNewsToFeedItem).slice(0, maxItems);

  return <NewsFeed items={newsItems} />;
}
