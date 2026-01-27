import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { AnsweredPrayersSection } from '@/components/section/community/prayer-requests/AnsweredPrayersSection';
import { PRAYER_REQUESTS_ITEMS } from '@/lib/constants/community/prayer-requests';
import type { AnsweredPrayer } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

export const metadata: Metadata = {
  title: 'Answered Prayers - Praise Reports',
  description:
    "Read testimonies of answered prayers. See how God has moved in response to our community's prayers.",
};

export const dynamic = 'force-dynamic';

async function generateAnsweredPrayersData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const answeredPrayers: AnsweredPrayer[] = PRAYER_REQUESTS_ITEMS.filter(item => item.isAnswered)
    .sort((a, b) => {
      const dateA = a.answeredDate || a.timeAgo;
      const dateB = b.answeredDate || b.timeAgo;
      return dateB.localeCompare(dateA);
    })
    .map(item => ({
      id: item.id,
      title: item.title,
      originalRequest: item.originalRequest || item.content,
      testimony: item.testimony || item.content,
      author: item.author,
      answeredDate: item.answeredDate || item.timeAgo,
      prayers: item.prayers,
    }));

  return {
    answeredPrayers,
  };
}

export default async function AnsweredPrayersPage() {
  const data = await generateAnsweredPrayersData();

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
          <AnsweredPrayersSection prayers={data.answeredPrayers} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
