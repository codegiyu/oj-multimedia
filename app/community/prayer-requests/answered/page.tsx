import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { AnsweredPrayersSection } from '@/components/section/community/prayer-requests/AnsweredPrayersSection';
import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';
import { CheckCircle } from 'lucide-react';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH, ISR_REVALIDATE } from '@/lib/constants/isr';
import { mapToAnsweredPrayer } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { AnsweredPrayer } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

export const revalidate = ISR_REVALIDATE.slow;

export const metadata: Metadata = {
  title: 'Answered Prayers - Praise Reports',
  description:
    "Read testimonies of answered prayers. See how God has moved in response to our community's prayers.",
};

async function fetchAnsweredPrayers(): Promise<{
  answeredPrayers: AnsweredPrayer[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi(
    'PUBLIC_GET_PRAYER_REQUESTS',
    {
      query: buildCommunityListQuery({ status: 'answered', limit: 50 }),
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return {
      answeredPrayers: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load answered prayers',
    };
  }

  const rawList = (res.data?.prayerRequests ?? []) as unknown[];

  return {
    answeredPrayers: rawList.map(i =>
      mapToAnsweredPrayer(i as Record<string, unknown>)
    ) as AnsweredPrayer[],
    initialErrorMessage: null,
  };
}

export default async function AnsweredPrayersPage() {
  const { answeredPrayers, initialErrorMessage } = await fetchAnsweredPrayers();

  return (
    <MainLayout>
      <SubPageHero
        title="Answered Prayers"
        titleHighlight="Answered"
        description="Read testimonies of answered prayers. See how God has moved in response to our community's prayers."
        badgeText="Praise Reports"
        badgeIcon="CheckCircle"
        backUrl="/community/prayer-requests"
        backLabel="Back to Prayer Requests"
        stats={[{ icon: 'CheckCircle', text: 'Prayers answered' }, { text: 'God is faithful' }]}
      />
      <Suspense fallback={<PrayerRequestsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          {initialErrorMessage && answeredPrayers.length === 0 ? (
            <DataLoadErrorWithRetry
              title="Unable to load answered prayers"
              message={initialErrorMessage}
              icon={<CheckCircle className="w-8 h-8 text-destructive" />}
            />
          ) : (
            <AnsweredPrayersSection prayers={answeredPrayers} />
          )}
        </div>
      </Suspense>
    </MainLayout>
  );
}
