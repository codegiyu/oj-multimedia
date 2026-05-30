import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { AnsweredQuestionsSection } from '@/components/section/community/ask-a-pastor/AnsweredQuestionsSection';
import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';
import { HelpCircle } from 'lucide-react';
import { filterByCategory } from '@/lib/utils/community/questions';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH, ISR_REVALIDATE } from '@/lib/constants/isr';
import { mapToAnsweredQuestion } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { AnsweredQuestion } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

export const revalidate = ISR_REVALIDATE.slow;

export const metadata: Metadata = {
  title: 'Answered Questions - Biblical Guidance',
  description:
    'Browse answered questions from our pastors. Get biblical guidance on faith, life, and spiritual matters.',
};

async function fetchAnsweredQuestions(category: string): Promise<{
  answeredQuestions: AnsweredQuestion[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi(
    'PUBLIC_GET_ASK_A_PASTOR_QUESTIONS',
    {
      query: buildCommunityListQuery({ status: 'answered', limit: 50, category }),
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return {
      answeredQuestions: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load questions',
    };
  }

  const rawList = (res.data?.questions ?? []) as unknown[];
  const list = rawList.map(i =>
    mapToAnsweredQuestion(i as Record<string, unknown>)
  ) as AnsweredQuestion[];

  return {
    answeredQuestions: filterByCategory(list, category),
    initialErrorMessage: null,
  };
}

interface AnsweredQuestionsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AnsweredQuestionsPage({ searchParams }: AnsweredQuestionsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const { answeredQuestions, initialErrorMessage } = await fetchAnsweredQuestions(category);

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
      <Suspense fallback={<AskAPastorPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          {initialErrorMessage && answeredQuestions.length === 0 ? (
            <DataLoadErrorWithRetry
              title="Unable to load questions"
              message={initialErrorMessage}
              icon={<HelpCircle className="w-8 h-8 text-destructive" />}
            />
          ) : (
            <AnsweredQuestionsSection questions={answeredQuestions} />
          )}
        </div>
      </Suspense>
    </MainLayout>
  );
}
