import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AskAPastorBrowseSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { ActiveQuestionsBrowseSection } from './_sections/ActiveQuestionsBrowseSection';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.fast` (60s). */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Active Questions - Awaiting Answers',
  description:
    'Browse questions that are currently awaiting answers from our pastors. Submit your own question or pray for those seeking guidance.',
};

interface ActiveQuestionsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function ActiveQuestionsPage({ searchParams }: ActiveQuestionsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const page = parseBrowsePageParam(params.page);

  return (
    <MainLayout>
      <SubPageHero
        title="Active Questions"
        titleHighlight="Active"
        description="Browse questions that are currently awaiting answers from our pastors. Submit your own question or pray for those seeking guidance."
        badgeText="Awaiting Answers"
        badgeIcon="HelpCircle"
        backUrl="/community/ask-a-pastor"
        backLabel="Back to Ask a Pastor"
        stats={[{ icon: 'HelpCircle', text: 'Seeking guidance' }, { text: 'Pastor answered' }]}
      />
      <Suspense fallback={<AskAPastorBrowseSkeleton />} key={`${category}|${page}`}>
        <ActiveQuestionsBrowseSection category={category} page={page} />
      </Suspense>
    </MainLayout>
  );
}
