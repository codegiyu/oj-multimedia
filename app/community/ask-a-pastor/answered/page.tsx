import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { AnsweredQuestionsBrowseSection } from './_sections/AnsweredQuestionsBrowseSection';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.slow` (3600s). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Answered Questions - Biblical Guidance',
  description:
    'Browse answered questions from our pastors. Get biblical guidance on faith, life, and spiritual matters.',
};

interface AnsweredQuestionsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function AnsweredQuestionsPage({ searchParams }: AnsweredQuestionsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const page = parseBrowsePageParam(params.page);

  return (
    <MainLayout>
      <SubPageHero
        title="Answered Questions"
        titleHighlight="Answered"
        description="Browse questions that have been answered by our pastors. Get biblical guidance on faith, life, and spiritual matters."
        badgeText="Biblical Answers"
        badgeIcon="HelpCircle"
        backUrl="/community/ask-a-pastor"
        backLabel="Back to Ask a Pastor"
        stats={[{ icon: 'HelpCircle', text: 'Pastor answered' }, { text: 'Biblical guidance' }]}
      />
      <Suspense fallback={<AskAPastorPageSkeleton />} key={`${category}|${page}`}>
        <AnsweredQuestionsBrowseSection category={category} page={page} />
      </Suspense>
    </MainLayout>
  );
}
