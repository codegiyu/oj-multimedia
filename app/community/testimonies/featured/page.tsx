import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { FeaturedTestimonies } from '@/components/section/community/testimonies/FeaturedTestimonies';
import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';
import { Sparkles } from 'lucide-react';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH, ISR_REVALIDATE } from '@/lib/constants/isr';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

export const revalidate = ISR_REVALIDATE.slow;

export const metadata: Metadata = {
  title: 'Featured Testimonies - Inspiring Stories',
  description:
    'Read featured testimonies of transformation, healing, and breakthrough from our community.',
};

async function fetchFeaturedTestimonies(): Promise<{
  featuredTestimonies: Testimony[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi(
    'PUBLIC_GET_TESTIMONIES',
    {
      query: buildCommunityListQuery({ type: 'featured', limit: 50 }),
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return {
      featuredTestimonies: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load testimonies',
    };
  }

  const rawList = (res.data?.testimonies ?? []) as unknown[];

  return {
    featuredTestimonies: rawList.map(i =>
      mapToTestimony(i as Record<string, unknown>)
    ) as Testimony[],
    initialErrorMessage: null,
  };
}

export default async function FeaturedTestimoniesPage() {
  const { featuredTestimonies, initialErrorMessage } = await fetchFeaturedTestimonies();

  return (
    <MainLayout>
      <SubPageHero
        title="Featured Testimonies"
        titleHighlight="Featured"
        description="Read featured testimonies of transformation, healing, and breakthrough from our community. These stories inspire and encourage."
        badgeText="Inspiring Stories"
        badgeIcon="Sparkles"
        backUrl="/community/testimonies"
        backLabel="Back to Testimonies"
        stats={[{ icon: 'Sparkles', text: 'Handpicked stories' }, { text: 'Inspiring content' }]}
      />
      <Suspense fallback={<TestimoniesPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          {initialErrorMessage && featuredTestimonies.length === 0 ? (
            <DataLoadErrorWithRetry
              title="Unable to load testimonies"
              message={initialErrorMessage}
              icon={<Sparkles className="w-8 h-8 text-destructive" />}
            />
          ) : (
            <FeaturedTestimonies testimonies={featuredTestimonies} />
          )}
        </div>
      </Suspense>
    </MainLayout>
  );
}
