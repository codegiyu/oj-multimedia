import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ActivePollsSectionSkeleton } from '../_sections/skeletons';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllPollsSection } from './_sections/AllPollsSection';

export const metadata: Metadata = {
  title: 'All Polls - Community Voting',
  description:
    'Search and browse every community poll. Filter by status, sort by popularity, and share your voice.',
};

interface AllPollsPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllPollsPage({ searchParams }: AllPollsPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Polls"
        titleHighlight="All"
        description="Search and browse every community poll — filter by status, sort by votes, and participate in the conversation."
        badgeText="Full Library"
        badgeIcon="Trophy"
        backUrl="/community/polls-and-voting"
        backLabel="Back to Polls"
        stats={[{ icon: 'CheckCircle', text: 'Active & closed' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<ActivePollsSectionSkeleton />} key={suspenseKey}>
        <AllPollsSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
