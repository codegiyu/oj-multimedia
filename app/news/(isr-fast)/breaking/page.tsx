import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { BreakingNewsPageClient } from '@/components/section/news/BreakingNewsPageClient';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import type { BreakingNewsStory } from '@/components/section/news/BreakingNews';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { filterPublicNewsList, mapPublicNewsToBreakingStory } from '@/lib/utils/publicApiMappers';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { newsCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';

export const metadata: Metadata = {
  title: 'Breaking News - Latest Urgent Stories',
  description:
    'High-priority breaking news and urgent announcements from OJ Multimedia, updated throughout the week.',
};

async function fetchBreakingStories(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${NEWS_TYPES.breaking}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, ISR_PUBLIC_FETCH.fast);

  if (res.type === 'error') {
    return {
      breakingStories: [] as BreakingNewsStory[],
      initialErrorMessage: res.error?.message ?? 'Failed to load breaking news',
    };
  }

  const raw = filterPublicNewsList(res.data?.articles ?? []);
  const breakingStories = filterByCategory(raw.map(mapPublicNewsToBreakingStory), category);
  return { breakingStories, initialErrorMessage: null as string | null };
}

interface BreakingNewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BreakingNewsPage({ searchParams }: BreakingNewsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope(
    'news',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );

  return (
    <MainLayout>
      <SubPageHero
        title="Breaking News"
        titleHighlight="Breaking"
        description="Urgent and high-priority stories from the past week — ministry announcements, major events, and time-sensitive updates."
        badgeText="Urgent"
        badgeIcon="Flame"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Flame', text: 'Priority 4–5' }, { text: 'Updated weekly' }]}
      />
      <Suspense fallback={<NewsPageSkeleton />}>
        <BreakingNewsServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function BreakingNewsServer({ category }: { category: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchBreakingStories(category),
    fetchPublicCategoryNav('news', 'All Stories', newsCategoryNavFallback, ISR_PUBLIC_FETCH.fast),
  ]);

  return <BreakingNewsPageClient {...data} categoryOptions={categoryOptions} />;
}
