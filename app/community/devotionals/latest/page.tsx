import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import {
  DevotionalsBrowseSkeleton,
  DevotionalsCategoryFilterSkeleton,
} from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { DevotionalsCategoryFilter } from '@/components/section/community/devotionals/DevotionalsCategoryFilter';
import { LatestDevotionalsSection } from './_sections/LatestDevotionalsSection';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

export const metadata: Metadata = {
  title: 'Latest Devotionals - Daily Inspiration',
  description: 'Browse the latest daily devotionals for inspiration and spiritual growth.',
};

interface LatestDevotionalsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function LatestDevotionalsPage({ searchParams }: LatestDevotionalsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const page = parseBrowsePageParam(params.page);

  return (
    <MainLayout>
      <SubPageHero
        title="Latest Devotionals"
        titleHighlight="Latest"
        description="Stay up to date with the most recent daily devotionals. Fresh inspiration delivered daily."
        badgeText="Daily Updates"
        badgeIcon="BookOpen"
        backUrl="/community/devotionals"
        backLabel="Back to Devotionals"
        stats={[{ icon: 'BookOpen', text: 'Updated daily' }, { text: 'Fresh content' }]}
      />
      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<DevotionalsCategoryFilterSkeleton />}>
          <DevotionalsCategoryFilter />
        </Suspense>
        <Suspense fallback={<DevotionalsBrowseSkeleton />} key={`${category}|${page}`}>
          <LatestDevotionalsSection category={category} page={page} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
