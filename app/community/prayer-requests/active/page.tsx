import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { ActivePrayerRequestsSection } from '@/components/section/community/prayer-requests/ActivePrayerRequestsSection';
import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';
import { HandHeart } from 'lucide-react';
import { filterByCategory } from '@/lib/utils/community/prayer-requests';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequest } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { PrayerRequest } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

export const metadata: Metadata = {
  title: 'Active Prayer Requests - Join in Prayer',
  description:
    'Browse active prayer requests from our community. Join us in praying for these needs and see how God is moving.',
};

async function fetchActivePrayerRequests(category: string): Promise<{
  activeRequests: PrayerRequest[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
    query: buildCommunityListQuery({ status: 'active', limit: 50, category }),
  });

  if (res.type === 'error') {
    return {
      activeRequests: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load prayer requests',
    };
  }

  const rawList = (res.data?.prayerRequests ?? []) as unknown[];
  const list = rawList.map(i =>
    mapToPrayerRequest(i as Record<string, unknown>)
  ) as PrayerRequest[];

  return {
    activeRequests: filterByCategory(list, category),
    initialErrorMessage: null,
  };
}

interface ActivePrayerRequestsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ActivePrayerRequestsPage({
  searchParams,
}: ActivePrayerRequestsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const { activeRequests, initialErrorMessage } = await fetchActivePrayerRequests(category);

  return (
    <MainLayout>
      <SubPageHero
        title="Active Prayer Requests"
        titleHighlight="Active"
        description="Browse active prayer requests from our community. Join us in praying for these needs and see how God is moving."
        badgeText="Join in Prayer"
        badgeIcon="HandHeart"
        backUrl="/community/prayer-requests"
        backLabel="Back to Prayer Requests"
        stats={[{ icon: 'HandHeart', text: 'Active requests' }, { text: 'Community prayers' }]}
      />
      <Suspense fallback={<PrayerRequestsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          {initialErrorMessage && activeRequests.length === 0 ? (
            <DataLoadErrorWithRetry
              title="Unable to load prayer requests"
              message={initialErrorMessage}
              icon={<HandHeart className="w-8 h-8 text-destructive" />}
            />
          ) : (
            <ActivePrayerRequestsSection requests={activeRequests} />
          )}
        </div>
      </Suspense>
    </MainLayout>
  );
}
