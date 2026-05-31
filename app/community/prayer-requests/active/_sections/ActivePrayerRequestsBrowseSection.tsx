import { ActivePrayerRequestsSection } from '@/components/section/community/prayer-requests/ActivePrayerRequestsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToPrayerRequest } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { PrayerRequest } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

type ActivePrayerRequestsBrowseSectionProps = {
  category: string;
  page: number;
};

export async function ActivePrayerRequestsBrowseSection({
  category,
  page,
}: ActivePrayerRequestsBrowseSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: {
      status: 'active',
      category: category && category !== 'all' ? category : undefined,
    },
  }) as `?${string}`;

  const res = await callPublicServerApi(
    'PUBLIC_GET_PRAYER_REQUESTS',
    { query },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Active prayer requests unavailable"
        message={res.error?.message ?? 'Failed to load prayer requests'}
      />
    );
  }

  const activeRequests = ((res.data?.prayerRequests ?? []) as unknown[]).map(i =>
    mapToPrayerRequest(i as Record<string, unknown>)
  ) as PrayerRequest[];

  return (
    <ActivePrayerRequestsSection
      requests={activeRequests}
      pagination={res.data?.pagination ?? null}
      presentation="browse-list"
    />
  );
}
