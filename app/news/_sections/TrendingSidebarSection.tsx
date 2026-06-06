import { TrendingSidebar } from '@/components/section/news/TrendingSidebar';
import { TrendingStoriesPageClient } from '@/components/section/news/TrendingStoriesPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToTrendingStory } from '@/lib/utils/publicApiMappers';
import { fetchPublicNewsArticles, type NewsSectionProps } from './shared';

type TrendingSidebarSectionProps = NewsSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function TrendingSidebarSection({
  category,
  limit = 15,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 6,
  showCategoryNav = false,
}: TrendingSidebarSectionProps) {
  const { articles, pagination, error } = await fetchPublicNewsArticles({
    category,
    page: variant === 'hub' ? 1 : page,
    limit: variant === 'hub' ? limit : undefined,
    type: NEWS_TYPES.trending,
    fetchOptions,
  });

  if (error && articles.length === 0) {
    return <SectionLoadError title="Trending stories unavailable" message={error} />;
  }

  const trendingStories = articles
    .map((item, i) => mapPublicNewsToTrendingStory(item, i + 1))
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <TrendingStoriesPageClient
        trendingStories={trendingStories}
        showCategoryNav={showCategoryNav}
        pagination={pagination}
      />
    );
  }

  return <TrendingSidebar stories={trendingStories} />;
}
