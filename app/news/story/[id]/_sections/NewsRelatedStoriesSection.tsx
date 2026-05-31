import { SectionLoadError } from '@/components/general/SectionLoadError';
import { NewsRelatedStoriesGrid } from '@/components/section/news/NewsRelatedStoriesGrid';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicNewsToDetailItem } from '@/lib/utils/publicApiMappers';
import type { NewsItem } from '@/lib/constants/news';

type NewsRelatedStoriesSectionProps = {
  id: string;
  categorySlug?: string;
};

export async function NewsRelatedStoriesSection({
  id,
  categorySlug = '',
}: NewsRelatedStoriesSectionProps) {
  const relatedRes = await callPublicServerApi('PUBLIC_GET_NEWS', {
    query: `?limit=4&page=1&status=published&type=latest${categorySlug}`,
  });

  if (relatedRes.type === 'error') {
    return (
      <SectionLoadError
        title="Related stories unavailable"
        message={relatedRes.error?.message ?? 'Failed to load related stories'}
      />
    );
  }

  const relatedList = relatedRes.data?.articles ?? [];
  const relatedStories: NewsItem[] = relatedList
    .filter(a => String(a._id) !== id)
    .slice(0, 3)
    .map(a => mapPublicNewsToDetailItem(a) as NewsItem);

  return <NewsRelatedStoriesGrid stories={relatedStories} />;
}
