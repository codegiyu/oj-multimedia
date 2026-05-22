import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { AllTestimonies } from '@/components/section/community/testimonies/AllTestimonies';
import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';
import { Clock } from 'lucide-react';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

export const metadata: Metadata = {
  title: 'Latest Testimonies - Recent Stories',
  description: 'Read the most recent testimonies shared by our community members.',
};

async function fetchLatestTestimonies(): Promise<{
  latestTestimonies: Testimony[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', {
    query: buildCommunityListQuery({ type: 'latest', limit: 50 }),
  });

  if (res.type === 'error') {
    return {
      latestTestimonies: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load testimonies',
    };
  }

  const rawList = (res.data?.testimonies ?? []) as unknown[];

  return {
    latestTestimonies: rawList.map(i =>
      mapToTestimony(i as Record<string, unknown>)
    ) as Testimony[],
    initialErrorMessage: null,
  };
}

export default async function LatestTestimoniesPage() {
  const { latestTestimonies, initialErrorMessage } = await fetchLatestTestimonies();

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
      <Suspense fallback={<TestimoniesPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          {initialErrorMessage && latestTestimonies.length === 0 ? (
            <DataLoadErrorWithRetry
              title="Unable to load testimonies"
              message={initialErrorMessage}
              icon={<Clock className="w-8 h-8 text-destructive" />}
            />
          ) : (
            <AllTestimonies testimonies={latestTestimonies} />
          )}
        </div>
      </Suspense>
    </MainLayout>
  );
}
