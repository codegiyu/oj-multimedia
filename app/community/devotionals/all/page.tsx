import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsBrowseSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllDevotionalsSection } from './_sections/AllDevotionalsSection';

export const metadata: Metadata = {
  title: 'All Devotionals - Browse Daily Inspiration',
  description:
    'Search and browse every published devotional. Filter by category, sort by popularity, and find daily inspiration.',
};

interface AllDevotionalsPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllDevotionalsPage({ searchParams }: AllDevotionalsPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Devotionals"
        titleHighlight="All"
        description="Search and browse every published devotional — filter by theme, sort by popularity, and grow in faith daily."
        badgeText="Full Library"
        badgeIcon="BookOpen"
        backUrl="/community/devotionals"
        backLabel="Back to Devotionals"
        stats={[{ icon: 'BookOpen', text: 'Every theme' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<DevotionalsBrowseSkeleton />} key={suspenseKey}>
        <AllDevotionalsSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
