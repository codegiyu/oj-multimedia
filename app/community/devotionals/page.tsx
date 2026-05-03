import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DevotionalsHero } from '@/components/section/community/devotionals/DevotionalsHero';
import {
  type BibleStudy,
  DevotionalsPageClient,
  type DailyDevotional,
  type PrayerPoint,
  type LivingTip,
  type MarriageFamily,
} from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  mapToDailyDevotional,
  mapToBibleStudy,
  mapToPrayerPoint,
  mapToLivingTip,
  mapToMarriageFamily,
} from '@/lib/utils/communityApiMappers';

export const metadata: Metadata = {
  title: 'Devotionals - Daily Inspiration & Bible Study',
  description:
    'Explore daily devotionals, Bible study series, prayer points, Christian living tips, and marriage & family guidance. Grow in your faith with inspiring content.',
};

const baseQuery = '?limit=12&page=1&status=published';

async function fetchDevotionalsData(): Promise<{
  dailyDevotionals: DailyDevotional[];
  bibleStudySeries: BibleStudy[];
  prayerPoints: PrayerPoint[];
  livingTips: LivingTip[];
  marriageFamily: MarriageFamily[];
  initialErrorMessage: string | null;
}> {
  const [dailyRes, bibleRes, prayerRes, livingRes, marriageRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
      query: `${baseQuery}&type=daily` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
      query: `${baseQuery}&type=bible-study` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
      query: `${baseQuery}&type=prayer-points` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
      query: `${baseQuery}&type=living-tips` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
      query: `${baseQuery}&type=marriage-family` as `?${string}`,
    }),
  ]);

  let errorMessage: string | null = null;
  if (dailyRes.type === 'error')
    errorMessage = dailyRes.error?.message ?? 'Failed to load devotionals';

  const mapList = (
    res: typeof dailyRes,
    mapper: (i: Record<string, unknown>) => unknown
  ): unknown[] => {
    if (res.type === 'error') return [];
    const list = (res.data?.devotionals ?? []) as unknown[];
    return list.map(item => mapper(item as Record<string, unknown>));
  };

  return {
    dailyDevotionals: mapList(dailyRes, mapToDailyDevotional) as DailyDevotional[],
    bibleStudySeries: mapList(bibleRes, mapToBibleStudy) as BibleStudy[],
    prayerPoints: mapList(prayerRes, mapToPrayerPoint) as PrayerPoint[],
    livingTips: mapList(livingRes, mapToLivingTip) as LivingTip[],
    marriageFamily: mapList(marriageRes, mapToMarriageFamily) as MarriageFamily[],
    initialErrorMessage: errorMessage,
  };
}

export default async function CommunityDevotionalsPage() {
  const devotionalsData = await fetchDevotionalsData();

  return (
    <MainLayout>
      <DevotionalsHero />
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <DevotionalsPageClient {...devotionalsData} />
      </Suspense>
    </MainLayout>
  );
}
