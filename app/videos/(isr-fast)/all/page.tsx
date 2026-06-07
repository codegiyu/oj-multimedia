import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { VideoSubpageGridSkeleton } from '../../_sections/skeletons';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllVideosSection } from '../../_sections/AllVideosSection';

export const metadata: Metadata = {
  title: 'All Videos - Browse Every Upload',
  description:
    'Search, filter, and sort every published video on OJ Multimedia — sermons, music videos, vlogs, and more.',
};

interface AllVideosPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllVideosPage({ searchParams }: AllVideosPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Videos"
        titleHighlight="All"
        description="Search and browse every published video — filter by category, sort by popularity, and discover fresh content."
        badgeText="Full Catalog"
        badgeIcon="Play"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Play', text: 'Every category' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<VideoSubpageGridSkeleton />} key={suspenseKey}>
        <AllVideosSection searchParams={params} fetchOptions={ISR_PUBLIC_FETCH.fast} />
      </Suspense>
    </MainLayout>
  );
}
