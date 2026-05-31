import { AnsweredPrayersSection } from '@/components/section/community/prayer-requests/AnsweredPrayersSection';
import { PrayerCategoriesSection } from '@/components/section/community/prayer-requests/PrayerCategoriesSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToAnsweredPrayer } from '@/lib/utils/communityApiMappers';
import type {
  AnsweredPrayer,
  PrayerCategory,
} from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';
import { PRAYER_CATEGORY_DISPLAY_VALUES } from '@/lib/constants/communityCategorySelectOptions';

export async function PrayerHubSupplementSection() {
  const res = await callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS_HUB', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Prayer hub data unavailable"
        message={res.error?.message ?? 'Failed to load answered prayers and categories'}
      />
    );
  }

  const answeredPrayers = ((res.data?.answeredPrayers ?? []) as unknown[]).map(i =>
    mapToAnsweredPrayer(i as Record<string, unknown>)
  ) as AnsweredPrayer[];
  const categoryCounts = res.data?.categoryCounts ?? {};

  const categories: PrayerCategory[] = PRAYER_CATEGORY_DISPLAY_VALUES.map(name => ({
    name,
    count: categoryCounts[name] ?? 0,
  }));

  return (
    <>
      <AnsweredPrayersSection prayers={answeredPrayers} />
      <PrayerCategoriesSection categories={categories} />
    </>
  );
}
