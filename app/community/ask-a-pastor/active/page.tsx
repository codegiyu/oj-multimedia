import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { ActiveQuestionsSection } from '@/components/section/community/ask-a-pastor/ActiveQuestionsSection';
import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';
import { HelpCircle } from 'lucide-react';
import { filterByCategory } from '@/lib/utils/community/questions';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH, ISR_REVALIDATE } from '@/lib/constants/isr';
import { mapToQuestion } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { Question } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

export const revalidate = ISR_REVALIDATE.fast;

export const metadata: Metadata = {
  title: 'Active Questions - Awaiting Answers',
  description:
    'Browse questions that are currently awaiting answers from our pastors. Submit your own question or pray for those seeking guidance.',
};

async function fetchActiveQuestions(category: string): Promise<{
  activeQuestions: Question[];
  initialErrorMessage: string | null;
}> {
  const res = await callPublicServerApi(
    'PUBLIC_GET_ASK_A_PASTOR_QUESTIONS',
    {
      query: buildCommunityListQuery({ status: 'active', limit: 50, category }),
    },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return {
      activeQuestions: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load questions',
    };
  }

  const rawList = (res.data?.questions ?? []) as unknown[];
  const list = rawList.map(i => mapToQuestion(i as Record<string, unknown>)) as Question[];

  return {
    activeQuestions: filterByCategory(list, category),
    initialErrorMessage: null,
  };
}

interface ActiveQuestionsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ActiveQuestionsPage({ searchParams }: ActiveQuestionsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const { activeQuestions, initialErrorMessage } = await fetchActiveQuestions(category);

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
      <Suspense fallback={<AskAPastorPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          {initialErrorMessage && activeQuestions.length === 0 ? (
            <DataLoadErrorWithRetry
              title="Unable to load questions"
              message={initialErrorMessage}
              icon={<HelpCircle className="w-8 h-8 text-destructive" />}
            />
          ) : (
            <ActiveQuestionsSection questions={activeQuestions} />
          )}
        </div>
      </Suspense>
    </MainLayout>
  );
}
