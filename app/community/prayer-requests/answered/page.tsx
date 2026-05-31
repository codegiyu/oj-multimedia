import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { AnsweredPrayersBrowseSection } from './_sections/AnsweredPrayersBrowseSection';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.slow` (3600s). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Answered Prayers - Praise Reports',
  description:
    "Read testimonies of answered prayers. See how God has moved in response to our community's prayers.",
};

interface AnsweredPrayersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AnsweredPrayersPage({ searchParams }: AnsweredPrayersPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);

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
      <Suspense fallback={<PrayerRequestsPageSkeleton />} key={page}>
        <AnsweredPrayersBrowseSection page={page} />
      </Suspense>
    </MainLayout>
  );
}
