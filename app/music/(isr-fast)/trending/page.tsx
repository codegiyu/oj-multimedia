import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import {
  MusicCategoriesSkeleton,
  MusicTrendingGridSectionSkeleton,
} from '@/components/section/music/skeletons';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { MusicCategoriesSection } from '../../_sections/MusicCategoriesSection';
import { TrendingSongsGridSection } from '../../_sections/TrendingSongsGridSection';

export const metadata: Metadata = {
  title: 'Trending Songs - Latest Music',
  description:
    "Discover what's trending now - the most popular songs everyone is listening to. Stay ahead of the music scene.",
};

interface TrendingSongsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingSongsPage({ searchParams }: TrendingSongsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope(
    'music',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );

  return (
    <MainLayout>
      <SubPageHero
        title="Trending Songs"
        titleHighlight="Trending"
        description="Discover what's hot right now - the most popular songs everyone is listening to. Stay ahead of the music scene."
        badgeText="What's Hot"
        badgeIcon="Flame"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }]}
      />
      <Suspense fallback={<MusicCategoriesSkeleton />}>
        <MusicCategoriesSection isr={ISR_PUBLIC_FETCH.fast} />
      </Suspense>
      <Suspense fallback={<MusicTrendingGridSectionSkeleton />}>
        <TrendingSongsGridSection category={category} />
      </Suspense>
    </MainLayout>
  );
}
