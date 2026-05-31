import { ActivePrayerRequestsSection as ActivePrayerRequests } from '@/components/section/community/prayer-requests/ActivePrayerRequestsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequest } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { PrayerRequest } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

const HUB_ACTIVE_LIMIT = 12;

type ActivePrayerRequestsSectionProps = {
  page: number;
};

export async function ActivePrayerRequestsSection({ page }: ActivePrayerRequestsSectionProps) {
  const query = buildBrowseListQuery({
    page,
    limit: HUB_ACTIVE_LIMIT,
    extra: { status: 'active' },
  }) as `?${string}`;

  const res = await callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', { query });

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

  return (
    <ActivePrayerRequests
      requests={activeRequests}
      pagination={activePagination}
      presentation="hub-section"
    />
  );
}
