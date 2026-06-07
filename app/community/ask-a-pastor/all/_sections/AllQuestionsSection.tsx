import { AllQuestionsPageClient } from '@/components/section/community/ask-a-pastor/AllQuestionsPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { mapToAnsweredQuestion, mapToQuestion } from '@/lib/utils/communityApiMappers';
import type {
  AnsweredQuestion,
  Question,
} from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

type AllQuestionsSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllQuestionsSection({ searchParams }: AllQuestionsSectionProps) {
  const config = getAllBrowseConfig('question');
  const category = await normalizePublicCategoryByScope('question', searchParams.category);
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const status = searchParams.status?.trim() || 'all';
  const listKind = status === 'answered' ? 'answered' : 'active';
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    category: category !== 'all' ? category : undefined,
    status: status !== 'all' ? status : undefined,
  });

  const res = await callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTIONS', { query });

  if (res.type === 'error') {
    return (
      <AllQuestionsPageClient
        config={config}
        listKind={listKind}
        activeQuestions={[]}
        answeredQuestions={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load questions'}
      />
    );
  }

  const rawItems = (res.data?.questions ?? []) as unknown[];

  if (listKind === 'answered') {
    const answeredQuestions = rawItems.map(item =>
      mapToAnsweredQuestion(item as Record<string, unknown>)
    ) as AnsweredQuestion[];

    return (
      <AllQuestionsPageClient
        config={config}
        listKind="answered"
        activeQuestions={[]}
        answeredQuestions={answeredQuestions}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  const activeQuestions = rawItems.map(item =>
    mapToQuestion(item as Record<string, unknown>)
  ) as Question[];

  return (
    <AllQuestionsPageClient
      config={config}
      listKind="active"
      activeQuestions={activeQuestions}
      answeredQuestions={[]}
      pagination={res.data?.pagination ?? null}
    />
  );
}
