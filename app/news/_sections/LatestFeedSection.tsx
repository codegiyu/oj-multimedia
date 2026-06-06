import { NewsFeed } from '@/components/section/news/NewsFeed';
import { LatestStoriesPageClient } from '@/components/section/news/LatestStoriesPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToFeedItem } from '@/lib/utils/publicApiMappers';
import { fetchPublicNewsArticles, type NewsSectionProps } from './shared';

type LatestFeedSectionProps = NewsSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function LatestFeedSection({
  category,
  limit = 15,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 10,
  showCategoryNav = false,
}: LatestFeedSectionProps) {
  const { articles, pagination, error } = await fetchPublicNewsArticles({
    category,
    page: variant === 'hub' ? 1 : page,
    limit: variant === 'hub' ? limit : undefined,
    type: NEWS_TYPES.latest,
    fetchOptions,
  });

  if (error && articles.length === 0) {
    return <SectionLoadError title="Latest stories unavailable" message={error} />;
  }

  const newsItems = articles
    .map(mapPublicNewsToFeedItem)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <LatestStoriesPageClient
        newsItems={newsItems}
        showCategoryNav={showCategoryNav}
        pagination={pagination}
      />
    );
  }

  return <NewsFeed items={newsItems} />;
}
