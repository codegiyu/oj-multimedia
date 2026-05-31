import { BreakingNews } from '@/components/section/news/BreakingNews';
import { BreakingNewsPageClient } from '@/components/section/news/BreakingNewsPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { filterPublicNewsList, mapPublicNewsToBreakingStory } from '@/lib/utils/publicApiMappers';
import { buildNewsBrowseQuery } from '@/lib/utils/newsBrowse';
import type { NewsSectionProps } from './shared';

type BreakingNewsSectionProps = NewsSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function BreakingNewsSection({
  category,
  limit = 15,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 8,
  showCategoryNav = false,
}: BreakingNewsSectionProps) {
  const query =
    variant === 'hub'
      ? buildNewsBrowseQuery(category, 1, { limit, type: NEWS_TYPES.breaking })
      : buildNewsBrowseQuery(category, page, { type: NEWS_TYPES.breaking });
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Breaking news unavailable"
        message={res.error?.message ?? 'Failed to load breaking news'}
      />
    );
  }

  const breakingStories = filterPublicNewsList(res.data?.articles ?? [])
    .map(mapPublicNewsToBreakingStory)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <BreakingNewsPageClient
        breakingStories={breakingStories}
        showCategoryNav={showCategoryNav}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  return <BreakingNews stories={breakingStories} />;
}
