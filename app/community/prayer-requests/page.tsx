import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestsHero } from '@/components/section/community/prayer-requests/PrayerRequestsHero';
import { PrayerRequestsPageClient } from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';

export const metadata: Metadata = {
  title: 'Prayer Requests - Share & Pray Together',
  description:
    'Share your prayer requests, pray for others, and witness answered prayers. Join our community in lifting each other up in prayer.',
};

// Generate prayer requests data (in a real app, this would come from an API or database)
async function generatePrayerRequestsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const activeRequests = [
    {
      id: 1,
      title: 'Prayer for Healing',
      content:
        'Please pray for my mother who is recovering from surgery. She needs strength and complete healing.',
      author: 'Sarah M.',
      category: 'Healing',
      prayers: 124,
      comments: 18,
      timeAgo: '2 hours ago',
      urgent: true,
    },
    {
      id: 2,
      title: 'Financial Breakthrough Needed',
      content:
        'Our family is facing financial difficulties. Please pray for God to open doors and provide for our needs.',
      author: 'Michael T.',
      category: 'Finance',
      prayers: 89,
      comments: 12,
      timeAgo: '5 hours ago',
      urgent: false,
    },
    {
      id: 3,
      title: 'Prayer for Job Opportunity',
      content:
        'I have been searching for employment for months. Please pray that God opens the right door for me.',
      author: 'David K.',
      category: 'Career',
      prayers: 156,
      comments: 24,
      timeAgo: '1 day ago',
      urgent: false,
    },
    {
      id: 4,
      title: 'Family Reconciliation',
      content:
        'Please pray for reconciliation in our family. There has been a lot of hurt and misunderstanding.',
      author: 'Jennifer L.',
      category: 'Family',
      prayers: 203,
      comments: 31,
      timeAgo: '2 days ago',
      urgent: false,
    },
    {
      id: 5,
      title: 'Prayer for Spiritual Growth',
      content:
        'I desire to grow deeper in my relationship with God. Please pray for wisdom and understanding.',
      author: 'Robert P.',
      category: 'Spiritual',
      prayers: 98,
      comments: 15,
      timeAgo: '3 days ago',
      urgent: false,
    },
    {
      id: 6,
      title: 'Prayer for Protection',
      content:
        'Please pray for protection over my children as they travel. I trust God to keep them safe.',
      author: 'Maria G.',
      category: 'Protection',
      prayers: 167,
      comments: 22,
      timeAgo: '4 days ago',
      urgent: false,
    },
  ];

  const answeredPrayers = [
    {
      id: 1,
      title: 'Praise Report: Job Found!',
      originalRequest: 'I was praying for a new job opportunity...',
      testimony:
        'God answered! I received a job offer that exceeded my expectations. Thank you all for praying!',
      author: 'James W.',
      answeredDate: '1 week ago',
      prayers: 245,
    },
    {
      id: 2,
      title: 'Healing Testimony',
      originalRequest: 'My daughter was very sick...',
      testimony:
        'My daughter has fully recovered! The doctors were amazed. God is faithful. Thank you for your prayers!',
      author: 'Linda H.',
      answeredDate: '2 weeks ago',
      prayers: 312,
    },
    {
      id: 3,
      title: 'Financial Breakthrough',
      originalRequest: 'We were struggling financially...',
      testimony:
        'Unexpected provision came through! God made a way where there seemed to be no way. Praise God!',
      author: 'Thomas R.',
      answeredDate: '3 weeks ago',
      prayers: 189,
    },
  ];

  // Only fetch category counts from the server
  const categoryCounts: Record<string, number> = {
    Healing: 156,
    Finance: 89,
    Family: 203,
    Career: 124,
    Spiritual: 98,
    Protection: 167,
  };

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
