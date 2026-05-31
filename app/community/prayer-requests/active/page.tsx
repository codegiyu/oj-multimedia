import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { PrayerRequestsPageSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { ActivePrayerRequestsBrowseSection } from './_sections/ActivePrayerRequestsBrowseSection';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.fast` (60s). */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Active Prayer Requests - Join in Prayer',
  description:
    'Browse active prayer requests from our community. Join us in praying for these needs and see how God is moving.',
};

interface ActivePrayerRequestsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function ActivePrayerRequestsPage({
  searchParams,
}: ActivePrayerRequestsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const page = parseBrowsePageParam(params.page);

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
      <Suspense fallback={<PrayerRequestsPageSkeleton />} key={`${category}|${page}`}>
        <ActivePrayerRequestsBrowseSection category={category} page={page} />
      </Suspense>
    </MainLayout>
  );
}
