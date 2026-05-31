import { FeaturedStories } from '@/components/section/news/FeaturedStories';
import { FeaturedStoriesPageClient } from '@/components/section/news/FeaturedStoriesPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { filterPublicNewsList, mapPublicNewsToFeaturedStory } from '@/lib/utils/publicApiMappers';
import { buildNewsBrowseQuery } from '@/lib/utils/newsBrowse';
import type { NewsSectionProps } from './shared';

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
  const query =
    variant === 'hub'
      ? buildNewsBrowseQuery(category, 1, { limit, type: NEWS_TYPES.featured })
      : buildNewsBrowseQuery(category, page, { type: NEWS_TYPES.featured });
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Featured stories unavailable"
        message={res.error?.message ?? 'Failed to load featured stories'}
      />
    );
  }

  const featuredStories = filterPublicNewsList(res.data?.articles ?? [])
    .map(mapPublicNewsToFeaturedStory)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <FeaturedStoriesPageClient
        featuredStories={featuredStories}
        showCategoryNav={showCategoryNav}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  return <FeaturedStories stories={featuredStories} />;
}
