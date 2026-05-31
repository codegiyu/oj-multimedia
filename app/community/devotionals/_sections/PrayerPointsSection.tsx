import { PrayerPointsSection as PrayerPoints } from '@/components/section/community/devotionals/PrayerPointsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerPoint } from '@/lib/utils/communityApiMappers';
import type { PrayerPoint } from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DEVOTIONALS_BASE_QUERY } from '../../_sections/shared';

export async function PrayerPointsSection() {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: `${DEVOTIONALS_BASE_QUERY}&type=prayer-points` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Prayer points unavailable"
        message={res.error?.message ?? 'Failed to load prayer points'}
      />
    );
  }

  const prayerPoints = ((res.data?.devotionals ?? []) as unknown[]).map(i =>
    mapToPrayerPoint(i as Record<string, unknown>)
  ) as PrayerPoint[];

  return <PrayerPoints prayerPoints={prayerPoints} />;
}
