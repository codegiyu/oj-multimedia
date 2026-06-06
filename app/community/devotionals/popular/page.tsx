import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsBrowseSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { DevotionalsCategoryFilter } from '@/components/section/community/devotionals/DevotionalsCategoryFilter';
import { PopularDevotionalsSection } from './_sections/PopularDevotionalsSection';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

export const metadata: Metadata = {
  title: 'Popular Devotionals - Most Read',
  description: 'Discover the most popular and widely read devotionals in our community.',
};

interface PopularDevotionalsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function PopularDevotionalsPage({
  searchParams,
}: PopularDevotionalsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const page = parseBrowsePageParam(params.page);

  return (
    <MainLayout>
      <SubPageHero
        title="Popular Devotionals"
        titleHighlight="Popular"
        description="Discover the most popular and widely read devotionals in our community. These are the devotionals that have touched the most hearts."
        badgeText="Most Read"
        badgeIcon="TrendingUp"
        backUrl="/community/devotionals"
        backLabel="Back to Devotionals"
        stats={[{ icon: 'TrendingUp', text: 'Most popular' }, { text: 'Community favorites' }]}
      />
      <div className="container mx-auto px-4 pb-16">
        <DevotionalsCategoryFilter />
        <Suspense fallback={<DevotionalsBrowseSkeleton />} key={`${category}|${page}`}>
          <PopularDevotionalsSection category={category} page={page} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
