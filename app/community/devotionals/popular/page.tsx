import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { DailyDevotionalsSection } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { filterByCategory } from '@/lib/utils/community/devotionals';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

export const metadata: Metadata = {
  title: 'Popular Devotionals - Most Read',
  description: 'Discover the most popular and widely read devotionals in our community.',
};

async function fetchPopularDevotionals(category: string): Promise<{
  popularDevotionals: DailyDevotional[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: buildCommunityListQuery({ type: 'popular', publishedOnly: true, category }),
  });

  if (res.type === 'error') {
    return {
      popularDevotionals: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load devotionals',
    };
  }

  const rawList = (res.data?.devotionals ?? []) as unknown[];
  const list = rawList.map(i =>
    mapToDailyDevotional(i as Record<string, unknown>)
  ) as DailyDevotional[];

  return {
    popularDevotionals: filterByCategory(list, category),
    initialErrorMessage: null,
  };
}

interface PopularDevotionalsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PopularDevotionalsPage({
  searchParams,
}: PopularDevotionalsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const { popularDevotionals, initialErrorMessage } = await fetchPopularDevotionals(category);

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
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <DailyDevotionalsSection
            devotionals={popularDevotionals}
            initialErrorMessage={initialErrorMessage}
          />
        </div>
      </Suspense>
    </MainLayout>
  );
}
