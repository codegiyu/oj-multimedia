import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestsHero } from '@/components/section/community/prayer-requests/PrayerRequestsHero';
import { PrayerRequestsPageClient } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { PRAYER_REQUESTS_ITEMS } from '@/lib/constants/community/prayer-requests';
import type {
  PrayerRequest,
  AnsweredPrayer,
} from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

export const metadata: Metadata = {
  title: 'Prayer Requests - Share & Pray Together',
  description:
    'Share your prayer requests, pray for others, and witness answered prayers. Join our community in lifting each other up in prayer.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate prayer requests data from central constants
async function generatePrayerRequestsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter and transform active requests
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

  // Filter and transform answered prayers
  const answeredPrayers: AnsweredPrayer[] = PRAYER_REQUESTS_ITEMS.filter(
    item => item.isAnswered
  ).map(item => ({
    _id: item._id,
    title: item.title,
    originalRequest: item.originalRequest || item.content,
    testimony: item.testimony || item.content,
    author: item.author,
    answeredDate: item.answeredDate || item.timeAgo,
    prayers: item.prayers,
  }));

  // Calculate category counts from active requests
  const categoryCounts: Record<string, number> = {};
  activeRequests.forEach(request => {
    categoryCounts[request.category] = (categoryCounts[request.category] || 0) + 1;
  });

  return {
    activeRequests,
    answeredPrayers,
    categoryCounts,
  };
}

export default async function CommunityPrayerRequestsPage() {
  const prayerRequestsData = await generatePrayerRequestsData();

  return (
    <MainLayout>
      <PrayerRequestsHero />
      <Suspense fallback={<PrayerRequestsPageSkeleton />}>
        <PrayerRequestsPageClient {...prayerRequestsData} />
      </Suspense>
    </MainLayout>
  );
}
