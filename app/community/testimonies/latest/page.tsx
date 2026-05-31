import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { LatestTestimoniesSection } from './_sections/LatestTestimoniesSection';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.fast` (60s). */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Latest Testimonies - Recent Stories',
  description: 'Read the most recent testimonies shared by our community members.',
};

interface LatestTestimoniesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function LatestTestimoniesPage({ searchParams }: LatestTestimoniesPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);

  return (
    <MainLayout>
      <SubPageHero
        title="Latest Testimonies"
        titleHighlight="Latest"
        description="Read the most recent testimonies shared by our community members. Fresh stories of hope and transformation."
        badgeText="Recent Stories"
        badgeIcon="Clock"
        backUrl="/community/testimonies"
        backLabel="Back to Testimonies"
        stats={[{ icon: 'Clock', text: 'Updated regularly' }, { text: 'Fresh content' }]}
      />
      <Suspense fallback={<TestimoniesPageSkeleton />} key={page}>
        <LatestTestimoniesSection page={page} />
      </Suspense>
    </MainLayout>
  );
}
