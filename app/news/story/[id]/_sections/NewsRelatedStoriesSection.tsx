import { SectionLoadError } from '@/components/general/SectionLoadError';
import { NewsRelatedStoriesGrid } from '@/components/section/news/NewsRelatedStoriesGrid';
import { fetchPublicNewsArticles } from '@/app/news/_sections/shared';
import { mapPublicNewsToDetailItem } from '@/lib/utils/publicApiMappers';
import type { NewsItem } from '@/lib/constants/news';

type NewsRelatedStoriesSectionProps = {
  id: string;
  categorySlug?: string;
};

export async function NewsRelatedStoriesSection({
  id,
  categorySlug = 'all',
}: NewsRelatedStoriesSectionProps) {
  const { articles, error } = await fetchPublicNewsArticles({
    category: categorySlug || 'all',
    limit: 4,
    page: 1,
    type: 'latest',
  });

  if (error && articles.length === 0) {
    return <SectionLoadError title="Related stories unavailable" message={error} />;
  }

  const relatedStories: NewsItem[] = articles
    .filter(a => String(a._id) !== id)
    .slice(0, 3)
    .map(a => mapPublicNewsToDetailItem(a) as NewsItem);

  return <NewsRelatedStoriesGrid stories={relatedStories} />;
}
