import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { DailyDevotionalsSection } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { DevotionalsCategoryFilter } from '@/components/section/community/devotionals/DevotionalsCategoryFilter';
import { filterByCategory } from '@/lib/utils/community/devotionals';
import { callServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

export const metadata: Metadata = {
  title: 'Latest Devotionals - Daily Inspiration',
  description: 'Browse the latest daily devotionals for inspiration and spiritual growth.',
};

export const dynamic = 'force-dynamic';

async function fetchLatestDevotionals(category: string): Promise<{
  latestDevotionals: DailyDevotional[];
  initialErrorMessage: string | null;
}> {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const res = await callServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: `?limit=50&page=1&status=published&type=latest${categoryParam}` as `?${string}`,
  });
  if (res.type === 'error') {
    return {
      latestDevotionals: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load devotionals',
    };
  }
  const rawList = (res.data?.devotionals ?? []) as unknown[];
  const list = rawList.map(i =>
    mapToDailyDevotional(i as Record<string, unknown>)
  ) as DailyDevotional[];
  return {
    latestDevotionals: filterByCategory(list, category),
    initialErrorMessage: null,
  };
}

interface LatestDevotionalsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function LatestDevotionalsPage({ searchParams }: LatestDevotionalsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const { latestDevotionals, initialErrorMessage } = await fetchLatestDevotionals(category);

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
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <Suspense fallback={<div className="h-10 mb-6 animate-pulse bg-muted rounded" />}>
            <DevotionalsCategoryFilter />
          </Suspense>
          <DailyDevotionalsSection
            devotionals={latestDevotionals}
            initialErrorMessage={initialErrorMessage}
          />
        </div>
      </Suspense>
    </MainLayout>
  );
}
