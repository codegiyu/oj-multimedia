import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { NewsCategoriesSection } from '../../_sections/NewsCategoriesSection';
import { BreakingNewsSection } from '../../_sections/BreakingNewsSection';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Breaking News - Latest Urgent Stories',
  description:
    'High-priority breaking news and urgent announcements from OJ Multimedia, updated throughout the week.',
};

interface BreakingNewsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BreakingNewsPage({ searchParams }: BreakingNewsPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);
  const category = await normalizePublicCategoryByScope(
    'news',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

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
      <Suspense fallback={<NewsCategoriesSkeleton />}>
        <NewsCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<NewsSubpageGridSkeleton />} key={`${category}|${page}`}>
        <BreakingNewsSection
          category={category}
          page={page}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
