import { Suspense } from 'react';
import { QuestionCategoriesSection } from '@/components/section/community/ask-a-pastor/QuestionCategoriesSection';
import { AnsweredQuestionsSection } from '@/components/section/community/ask-a-pastor/AnsweredQuestionsSection';
import { AvailablePastorsSection } from '@/components/section/community/ask-a-pastor/AvailablePastorsSection';
import { SubmitQuestionSection } from '@/components/section/community/ask-a-pastor/SubmitQuestionSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToAnsweredQuestion, mapToPastor } from '@/lib/utils/communityApiMappers';
import type {
  AnsweredQuestion,
  AvailablePastor,
  QuestionCategory,
} from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';
import { ASK_A_PASTOR_CATEGORY_DISPLAY_VALUES } from '@/lib/constants/communityCategorySelectOptions';

export async function AskAPastorHubSupplementSection() {
  const res = await callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_HUB', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Ask a pastor hub unavailable"
        message={res.error?.message ?? 'Failed to load pastor hub data'}
      />
    );
  }

  const answeredQuestions = ((res.data?.answeredQuestions ?? []) as unknown[]).map(i =>
    mapToAnsweredQuestion(i as Record<string, unknown>)
  ) as AnsweredQuestion[];
  const availablePastors = ((res.data?.pastors ?? []) as unknown[]).map(i =>
    mapToPastor(i as Record<string, unknown>)
  ) as AvailablePastor[];
  const categoryCounts = res.data?.categoryCounts ?? {};

  const categories: QuestionCategory[] = ASK_A_PASTOR_CATEGORY_DISPLAY_VALUES.map(name => ({
    name,
    count: categoryCounts[name] ?? 0,
  }));

  return (
    <>
      <QuestionCategoriesSection categories={categories} />
      <AnsweredQuestionsSection questions={answeredQuestions} />
      <AvailablePastorsSection pastors={availablePastors} />
      <Suspense fallback={null}>
        <SubmitQuestionSection pastors={availablePastors} />
      </Suspense>
    </>
  );
}
