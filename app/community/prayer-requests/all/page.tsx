import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { PrayerRequestsBrowseSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllPrayerRequestsSection } from './_sections/AllPrayerRequestsSection';

export const metadata: Metadata = {
  title: 'All Prayer Requests - Pray Together',
  description:
    'Search and browse every prayer request. Filter by status and category, and join others in prayer.',
};

interface AllPrayerRequestsPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllPrayerRequestsPage({ searchParams }: AllPrayerRequestsPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Prayer Requests"
        titleHighlight="All"
        description="Search and browse every prayer request — filter by status or category and stand in prayer with the community."
        badgeText="Full Library"
        badgeIcon="HandHeart"
        backUrl="/community/prayer-requests"
        backLabel="Back to Prayer Requests"
        stats={[{ icon: 'HandHeart', text: 'Active & answered' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<PrayerRequestsBrowseSkeleton />} key={suspenseKey}>
        <AllPrayerRequestsSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
