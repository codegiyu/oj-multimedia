import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AskAPastorHero } from '@/components/section/community/ask-a-pastor/AskAPastorHero';
import {
  AskAPastorPageClient,
  type Question,
  type AnsweredQuestion,
  type AvailablePastor,
} from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import { mapToQuestion, mapToAnsweredQuestion, mapToPastor } from '@/lib/utils/communityApiMappers';

export const metadata: Metadata = {
  title: 'Ask a Pastor - Get Biblical Guidance',
  description:
    'Submit your questions to our pastors, browse answered questions, and get biblical guidance on faith, life, and spiritual matters.',
};

export const dynamic = 'force-dynamic';

async function fetchAskAPastorData(): Promise<{
  activeQuestions: Question[];
  answeredQuestions: AnsweredQuestion[];
  availablePastors: AvailablePastor[];
  categoryCounts: Record<string, number>;
  initialErrorMessage: string | null;
}> {
  const [activeRes, answeredRes, pastorsRes] = await Promise.all([
    callServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTIONS', {
      query: '?limit=50&page=1&status=active' as `?${string}`,
    }),
    callServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTIONS', {
      query: '?limit=20&page=1&status=answered' as `?${string}`,
    }),
    callServerApi('PUBLIC_GET_ASK_A_PASTOR_PASTORS', {}),
  ]);
  const errorMessage =
    activeRes.type === 'error' ? (activeRes.error?.message ?? 'Failed to load questions') : null;

  const activeQuestions = (
    (activeRes.type === 'success' ? (activeRes.data?.questions as unknown[]) : []) ?? []
  ).map(i => mapToQuestion(i as Record<string, unknown>)) as Question[];

  const answeredQuestions = (
    (answeredRes.type === 'success' ? (answeredRes.data?.questions as unknown[]) : []) ?? []
  ).map(i => mapToAnsweredQuestion(i as Record<string, unknown>)) as AnsweredQuestion[];

  const availablePastors = (
    (pastorsRes.type === 'success' ? (pastorsRes.data?.pastors as unknown[]) : []) ?? []
  ).map(i => mapToPastor(i as Record<string, unknown>)) as AvailablePastor[];
  const categoryCounts: Record<string, number> = {};
  [...activeQuestions, ...answeredQuestions].forEach(q => {
    if (q.category) categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  });
  return {
    activeQuestions,
    answeredQuestions,
    availablePastors,
    categoryCounts,
    initialErrorMessage: errorMessage,
  };
}

export default async function CommunityAskAPastorPage() {
  const askAPastorData = await fetchAskAPastorData();

  return (
    <MainLayout>
      <AskAPastorHero />
      <Suspense fallback={<AskAPastorPageSkeleton />}>
        <AskAPastorPageClient {...askAPastorData} />
      </Suspense>
    </MainLayout>
  );
}
