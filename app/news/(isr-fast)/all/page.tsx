import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { LatestFeedSectionSkeleton } from '../../_sections/skeletons';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllNewsSection } from '../../_sections/AllNewsSection';

export const metadata: Metadata = {
  title: 'All Stories - Browse News',
  description:
    'Search, filter, and sort every published story on OJ Multimedia — news, culture, lifestyle, and inspiration.',
};

interface AllNewsPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllNewsPage({ searchParams }: AllNewsPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Stories"
        titleHighlight="All"
        description="Search and browse every published story — filter by topic, sort by popularity, and stay informed."
        badgeText="Full Catalog"
        badgeIcon="BookOpen"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'BookOpen', text: 'Every topic' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<LatestFeedSectionSkeleton />} key={suspenseKey}>
        <AllNewsSection searchParams={params} fetchOptions={ISR_PUBLIC_FETCH.fast} />
      </Suspense>
    </MainLayout>
  );
}
