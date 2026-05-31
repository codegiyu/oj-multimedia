import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import {
  MusicCategoriesSkeleton,
  TopChartsSectionSkeleton,
} from '@/components/section/music/skeletons';
import { CHART_PERIOD_VALUES } from '@/lib/constants/contentTaxonomy';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { MusicCategoriesSection } from '../../_sections/MusicCategoriesSection';
import { TopChartsGridSection } from '../../_sections/TopChartsGridSection';

export const metadata: Metadata = {
  title: 'Top Charts - Music Rankings',
  description:
    'View the top music charts across all genres. See what songs are ranking highest this week, month, or all-time.',
};

interface TopChartsPageProps {
  searchParams: Promise<{ category?: string; period?: string }>;
}

export default async function TopChartsPage({ searchParams }: TopChartsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope(
    'music',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );
  const period = CHART_PERIOD_VALUES.includes(
    (params.period ?? 'weekly') as (typeof CHART_PERIOD_VALUES)[number]
  )
    ? (params.period ?? 'weekly')
    : 'weekly';

  return (
    <MainLayout>
      <SubPageHero
        title="Top Charts"
        titleHighlight="Top"
        description="View the top music charts across all genres. See what songs are ranking highest this week, month, or all-time."
        badgeText="Charts"
        badgeIcon="Trophy"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[
          { icon: 'Trophy', text: 'Top rankings' },
          {
            text:
              period === 'weekly'
                ? 'Weekly updates'
                : period === 'monthly'
                  ? 'Monthly updates'
                  : 'All-time rankings',
          },
        ]}
      />
      <Suspense fallback={<MusicCategoriesSkeleton />}>
        <MusicCategoriesSection isr={ISR_PUBLIC_FETCH.fast} />
      </Suspense>
      <Suspense fallback={<TopChartsSectionSkeleton showFooterButton={false} />}>
        <TopChartsGridSection category={category} period={period} />
      </Suspense>
    </MainLayout>
  );
}
