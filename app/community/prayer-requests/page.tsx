import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestsHero } from '@/components/section/community/prayer-requests/PrayerRequestsHero';
import { SubmitPrayerRequestSection } from '@/components/section/community/prayer-requests/SubmitPrayerRequestSection';
import { CommunityCTA } from '@/components/section/shared';
import { ActivePrayerRequestsSection } from './_sections/ActivePrayerRequestsSection';
import { PrayerHubSupplementSection } from './_sections/PrayerHubSupplementSection';
import {
  ActivePrayerRequestsSectionSkeleton,
  PrayerHubSupplementSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Prayer Requests - Share & Pray Together',
  description:
    'Share your prayer requests, pray for others, and witness answered prayers. Join our community in lifting each other up in prayer.',
};

interface PrayerRequestsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CommunityPrayerRequestsPage({
  searchParams,
}: PrayerRequestsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? '1'), 10) || 1);

  return (
    <MainLayout>
      <PrayerRequestsHero />
      <Suspense fallback={<ActivePrayerRequestsSectionSkeleton />} key={page}>
        <ActivePrayerRequestsSection page={page} />
      </Suspense>
      <SubmitPrayerRequestSection />
      <Suspense fallback={<PrayerHubSupplementSectionSkeleton />}>
        <PrayerHubSupplementSection />
      </Suspense>
      <CommunityCTA />
    </MainLayout>
  );
}
