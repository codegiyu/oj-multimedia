import { FeaturedStories } from '@/components/section/news/FeaturedStories';
import { FeaturedStoriesPageClient } from '@/components/section/news/FeaturedStoriesPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToFeaturedStory } from '@/lib/utils/publicApiMappers';
import { fetchPublicNewsArticles, type NewsSectionProps } from './shared';

type FeaturedStoriesSectionProps = NewsSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function FeaturedStoriesSection({
  category,
  limit = 15,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 3,
  showCategoryNav = false,
}: FeaturedStoriesSectionProps) {
  const { articles, pagination, error } = await fetchPublicNewsArticles({
    category,
    page: variant === 'hub' ? 1 : page,
    limit: variant === 'hub' ? limit : undefined,
    type: NEWS_TYPES.featured,
    fetchOptions,
  });

  if (error && articles.length === 0) {
    return <SectionLoadError title="Featured stories unavailable" message={error} />;
  }

  const featuredStories = articles
    .map(mapPublicNewsToFeaturedStory)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <FeaturedStoriesPageClient
        featuredStories={featuredStories}
        showCategoryNav={showCategoryNav}
        pagination={pagination}
      />
    );
  }

  return <FeaturedStories stories={featuredStories} />;
}
