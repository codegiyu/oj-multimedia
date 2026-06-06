import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { NewsCategoriesSection } from '../../_sections/NewsCategoriesSection';
import { LatestFeedSection } from '../../_sections/LatestFeedSection';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Latest Stories - News & Lifestyle Updates',
  description:
    'Browse the latest news, announcements, inspirational stories, and lifestyle updates as they are published.',
};

interface LatestStoriesPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function LatestStoriesPage({ searchParams }: LatestStoriesPageProps) {
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
        title="Latest Stories"
        titleHighlight="Latest"
        description="Stay current with freshly published stories — news, lifestyle, culture, and inspiration from across OJ Multimedia."
        badgeText="Fresh Updates"
        badgeIcon="Clock"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Clock', text: 'Newest first' }, { text: 'Updated throughout the day' }]}
      />
      <Suspense fallback={<NewsCategoriesSkeleton />}>
        <NewsCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<NewsSubpageGridSkeleton />} key={`${category}|${page}`}>
        <LatestFeedSection
          category={category}
          page={page}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
