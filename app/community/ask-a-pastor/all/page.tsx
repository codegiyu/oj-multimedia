import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AskAPastorBrowseSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllQuestionsSection } from './_sections/AllQuestionsSection';

export const metadata: Metadata = {
  title: 'All Questions - Ask a Pastor',
  description:
    'Search and browse every question submitted to our pastors. Filter by status and category for biblical guidance.',
};

interface AllQuestionsPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllQuestionsPage({ searchParams }: AllQuestionsPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Questions"
        titleHighlight="All"
        description="Search and browse every question — filter by status or topic and find biblical answers from our pastors."
        badgeText="Full Library"
        badgeIcon="HelpCircle"
        backUrl="/community/ask-a-pastor"
        backLabel="Back to Ask a Pastor"
        stats={[{ icon: 'HelpCircle', text: 'Active & answered' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<AskAPastorBrowseSkeleton />} key={suspenseKey}>
        <AllQuestionsSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
