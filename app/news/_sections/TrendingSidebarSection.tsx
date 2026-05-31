import { TrendingSidebar } from '@/components/section/news/TrendingSidebar';
import { TrendingStoriesPageClient } from '@/components/section/news/TrendingStoriesPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToTrendingStory } from '@/lib/utils/publicApiMappers';
import { buildNewsBaseQuery, type NewsSectionProps } from './shared';

type TrendingSidebarSectionProps = NewsSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function TrendingSidebarSection({
  category,
  limit = 15,
  fetchOptions,
  variant = 'hub',
  maxItems = 6,
  showCategoryNav = false,
}: TrendingSidebarSectionProps) {
  const query = `${buildNewsBaseQuery(category, limit)}&type=${NEWS_TYPES.trending}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending stories unavailable"
        message={res.error?.message ?? 'Failed to load trending stories'}
      />
    );
  }

  const trendingStories = (res.data?.articles ?? [])
    .map((item, i) => mapPublicNewsToTrendingStory(item, i + 1))
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <TrendingStoriesPageClient
        trendingStories={trendingStories}
        showCategoryNav={showCategoryNav}
      />
    );
  }

  return <TrendingSidebar stories={trendingStories} />;
}
