import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { ActivePrayerRequestsSection } from '@/components/section/community/prayer-requests/ActivePrayerRequestsSection';
import { filterByCategory } from '@/lib/utils/community/prayer-requests';
import { PRAYER_REQUESTS_ITEMS } from '@/lib/constants/community/prayer-requests';
import type { PrayerRequest } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

export const metadata: Metadata = {
  title: 'Active Prayer Requests - Join in Prayer',
  description:
    'Browse active prayer requests from our community. Join us in praying for these needs and see how God is moving.',
};

async function generateActivePrayerRequestsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const activeRequests: PrayerRequest[] = PRAYER_REQUESTS_ITEMS.filter(item => item.isActive).map(
    item => ({
      _id: item._id,
      title: item.title,
      content: item.content,
      author: item.author,
      category: item.category,
      prayers: item.prayers,
      comments: item.comments,
      timeAgo: item.timeAgo,
      urgent: item.urgent,
    })
  );

  return {
    activeRequests,
  };
}

interface ActivePrayerRequestsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ActivePrayerRequestsPage({
  searchParams,
}: ActivePrayerRequestsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateActivePrayerRequestsData();

  const filteredData = {
    activeRequests: filterByCategory(data.activeRequests, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Active Prayer Requests"
        titleHighlight="Active"
        description="Browse active prayer requests from our community. Join us in praying for these needs and see how God is moving."
        badgeText="Join in Prayer"
        badgeIcon="HandHeart"
        backUrl="/community/prayer-requests"
        backLabel="Back to Prayer Requests"
        stats={[{ icon: 'HandHeart', text: 'Active requests' }, { text: 'Community prayers' }]}
      />
      <Suspense fallback={<PrayerRequestsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <ActivePrayerRequestsSection requests={filteredData.activeRequests} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
