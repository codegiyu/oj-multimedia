import { AnsweredQuestionsSection } from '@/components/section/community/ask-a-pastor/AnsweredQuestionsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToAnsweredQuestion } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { AnsweredQuestion } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

type AnsweredQuestionsBrowseSectionProps = {
  category: string;
  page: number;
};

export async function AnsweredQuestionsBrowseSection({
  category,
  page,
}: AnsweredQuestionsBrowseSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: {
      status: 'answered',
      category: category && category !== 'all' ? category : undefined,
    },
  }) as `?${string}`;

  const res = await callPublicServerApi(
    'PUBLIC_GET_ASK_A_PASTOR_QUESTIONS',
    { query },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Answered questions unavailable"
        message={res.error?.message ?? 'Failed to load questions'}
      />
    );
  }

  const answeredQuestions = ((res.data?.questions ?? []) as unknown[]).map(i =>
    mapToAnsweredQuestion(i as Record<string, unknown>)
  ) as AnsweredQuestion[];

  return (
    <AnsweredQuestionsSection
      questions={answeredQuestions}
      pagination={res.data?.pagination ?? null}
      presentation="browse-list"
    />
  );
}
