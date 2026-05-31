import { AnsweredPrayersSection } from '@/components/section/community/prayer-requests/AnsweredPrayersSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToAnsweredPrayer } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { AnsweredPrayer } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

type AnsweredPrayersBrowseSectionProps = {
  page: number;
};

export async function AnsweredPrayersBrowseSection({ page }: AnsweredPrayersBrowseSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: { status: 'answered' },
  }) as `?${string}`;

  const res = await callPublicServerApi(
    'PUBLIC_GET_PRAYER_REQUESTS',
    { query },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Answered prayers unavailable"
        message={res.error?.message ?? 'Failed to load answered prayers'}
      />
    );
  }

  const answeredPrayers = ((res.data?.prayerRequests ?? []) as unknown[]).map(i =>
    mapToAnsweredPrayer(i as Record<string, unknown>)
  ) as AnsweredPrayer[];

  return (
    <AnsweredPrayersSection
      prayers={answeredPrayers}
      pagination={res.data?.pagination ?? null}
      presentation="browse-list"
    />
  );
}
