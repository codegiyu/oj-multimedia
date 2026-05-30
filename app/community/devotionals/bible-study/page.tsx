import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { BibleStudySeriesSection } from '@/components/section/community/devotionals/BibleStudySeriesSection';
import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';
import { BookOpen } from 'lucide-react';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH, ISR_REVALIDATE } from '@/lib/constants/isr';
import { mapToBibleStudy } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { BibleStudy } from '@/components/section/community/devotionals/DevotionalsPageClient';

export const revalidate = ISR_REVALIDATE.slow;

export const metadata: Metadata = {
  title: 'Bible Study Series - Deep Dive into Scripture',
  description:
    "Explore comprehensive Bible study series designed to deepen your understanding of God's Word.",
};

async function fetchBibleStudySeries(): Promise<{
  bibleStudySeries: BibleStudy[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi(
    'PUBLIC_GET_DEVOTIONALS',
    {
      query: buildCommunityListQuery({ type: 'bible-study', publishedOnly: true }),
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return {
      bibleStudySeries: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load bible study series',
    };
  }

  const rawList = (res.data?.devotionals ?? []) as unknown[];

  return {
    bibleStudySeries: rawList.map(i =>
      mapToBibleStudy(i as Record<string, unknown>)
    ) as BibleStudy[],
    initialErrorMessage: null,
  };
}

export default async function BibleStudyPage() {
  const { bibleStudySeries, initialErrorMessage } = await fetchBibleStudySeries();

  return (
    <MainLayout>
      <SubPageHero
        title="Bible Study Series"
        titleHighlight="Bible Study"
        description="Explore comprehensive Bible study series designed to deepen your understanding of God's Word. Join thousands of participants in these transformative studies."
        badgeText="In-Depth Studies"
        badgeIcon="BookOpen"
        backUrl="/community/devotionals"
        backLabel="Back to Devotionals"
        stats={[{ icon: 'BookOpen', text: 'Deep learning' }, { text: 'Community studies' }]}
      />
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          {initialErrorMessage && bibleStudySeries.length === 0 ? (
            <DataLoadErrorWithRetry
              title="Unable to load bible study series"
              message={initialErrorMessage}
              icon={<BookOpen className="w-8 h-8 text-destructive" />}
            />
          ) : (
            <BibleStudySeriesSection series={bibleStudySeries} />
          )}
        </div>
      </Suspense>
    </MainLayout>
  );
}
