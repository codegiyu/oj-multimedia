import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TestimoniesBrowseSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllTestimoniesBrowseSection } from './_sections/AllTestimoniesBrowseSection';

export const metadata: Metadata = {
  title: 'All Testimonies - Stories of Faith',
  description:
    'Search and browse every testimony. Filter by category and discover inspiring stories of healing, breakthrough, and faith.',
};

interface AllTestimoniesPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllTestimoniesPage({ searchParams }: AllTestimoniesPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Testimonies"
        titleHighlight="All"
        description="Search and browse every testimony — filter by theme and be inspired by stories of God's faithfulness."
        badgeText="Full Library"
        badgeIcon="Sparkles"
        backUrl="/community/testimonies"
        backLabel="Back to Testimonies"
        stats={[{ icon: 'Star', text: 'Every story' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<TestimoniesBrowseSkeleton />} key={suspenseKey}>
        <AllTestimoniesBrowseSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
