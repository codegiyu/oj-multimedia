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
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequest, mapToAnsweredPrayer } from '@/lib/utils/communityApiMappers';
import type { Pagination } from '@/lib/types/community';

export const metadata: Metadata = {
  title: 'Prayer Requests - Share & Pray Together',
  description:
    'Share your prayer requests, pray for others, and witness answered prayers. Join our community in lifting each other up in prayer.',
};


const ACTIVE_LIMIT = 12;

async function fetchPrayerRequestsData(page: number): Promise<{
  activeRequests: PrayerRequest[];
  answeredPrayers: AnsweredPrayer[];
  categoryCounts: Record<string, number>;
  activePagination: Pagination | null;
  initialErrorMessage: string | null;
}> {
  const [activeRes, answeredRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
      query: `?limit=${ACTIVE_LIMIT}&page=${page}&status=active` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
      query: '?limit=20&page=1&status=answered' as `?${string}`,
    }),
  ]);
  const errorMessage =
    activeRes.type === 'error'
      ? (activeRes.error?.message ?? 'Failed to load prayer requests')
      : null;
  const activeRequests = (
    activeRes.type === 'success' ? (activeRes.data?.prayerRequests ?? []) : []
  ).map(i => mapToPrayerRequest(i as unknown as Record<string, unknown>)) as PrayerRequest[];
  const answeredPrayers = (
    answeredRes.type === 'success' ? (answeredRes.data?.prayerRequests ?? []) : []
  ).map(i => mapToAnsweredPrayer(i as unknown as Record<string, unknown>)) as AnsweredPrayer[];
  const categoryCounts: Record<string, number> = {};
  activeRequests.forEach(r => {
    if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });
  const activePagination =
    activeRes.type === 'success' ? (activeRes.data?.pagination ?? null) : null;
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
