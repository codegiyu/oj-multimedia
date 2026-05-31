import { ActivePrayerRequestsSection as ActivePrayerRequests } from '@/components/section/community/prayer-requests/ActivePrayerRequestsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequest } from '@/lib/utils/communityApiMappers';
import type { PrayerRequest } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

const ACTIVE_LIMIT = 12;

type ActivePrayerRequestsSectionProps = {
  page: number;
};

export async function ActivePrayerRequestsSection({ page }: ActivePrayerRequestsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
    query: `?limit=${ACTIVE_LIMIT}&page=${page}&status=active` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Active prayer requests unavailable"
        message={res.error?.message ?? 'Failed to load active prayer requests'}
      />
    );
  }

  const activeRequests = ((res.data?.prayerRequests ?? []) as unknown[]).map(i =>
    mapToPrayerRequest(i as Record<string, unknown>)
  ) as PrayerRequest[];
  const activePagination = res.data?.pagination ?? null;

  return <ActivePrayerRequests requests={activeRequests} pagination={activePagination} />;
}
