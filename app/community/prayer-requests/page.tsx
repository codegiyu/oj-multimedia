import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestsHero } from '@/components/section/community/prayer-requests/PrayerRequestsHero';
import { PrayerRequestsPageClient } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import type {
  PrayerRequest,
  AnsweredPrayer,
} from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IPublicPrayerRequestsListRes } from '@/lib/constants/endpoints';
import { mapToPrayerRequest, mapToAnsweredPrayer } from '@/lib/utils/communityApiMappers';
import type { Pagination } from '@/lib/types/community';

export const metadata: Metadata = {
  title: 'Prayer Requests - Share & Pray Together',
  description:
    'Share your prayer requests, pray for others, and witness answered prayers. Join our community in lifting each other up in prayer.',
};

export const dynamic = 'force-dynamic';

const ACTIVE_LIMIT = 12;

async function fetchPrayerRequestsData(page: number): Promise<{
  activeRequests: PrayerRequest[];
  answeredPrayers: AnsweredPrayer[];
  categoryCounts: Record<string, number>;
  activePagination: Pagination | null;
  initialErrorMessage: string | null;
}> {
  const [activeRes, answeredRes] = await Promise.all([
    callServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
      query: `?limit=${ACTIVE_LIMIT}&page=${page}&status=active` as `?${string}`,
    }),
    callServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
      query: '?limit=20&page=1&status=answered' as `?${string}`,
    }),
  ]);
  const errorMessage = activeRes.error
    ? ((activeRes.error as ApiErrorResponse)?.message ?? 'Failed to load prayer requests')
    : null;
  const activeData = activeRes.data as IPublicPrayerRequestsListRes | undefined;
  const answeredData = answeredRes.data as IPublicPrayerRequestsListRes | undefined;
  const activeRequests = (activeData?.prayerRequests ?? []).map(i =>
    mapToPrayerRequest(i as unknown as Record<string, unknown>)
  ) as PrayerRequest[];
  const answeredPrayers = (answeredData?.prayerRequests ?? []).map(i =>
    mapToAnsweredPrayer(i as unknown as Record<string, unknown>)
  ) as AnsweredPrayer[];
  const categoryCounts: Record<string, number> = {};
  activeRequests.forEach(r => {
    if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });
  const activePagination = activeData?.pagination ?? null;
  return {
    activeRequests,
    answeredPrayers,
    categoryCounts,
    activePagination,
    initialErrorMessage: errorMessage,
  };
}

interface PrayerRequestsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CommunityPrayerRequestsPage({
  searchParams,
}: PrayerRequestsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? '1'), 10) || 1);
  const prayerRequestsData = await fetchPrayerRequestsData(page);

  return (
    <MainLayout>
      <PrayerRequestsHero />
      <Suspense fallback={<PrayerRequestsPageSkeleton />}>
        <PrayerRequestsPageClient {...prayerRequestsData} />
      </Suspense>
    </MainLayout>
  );
}
