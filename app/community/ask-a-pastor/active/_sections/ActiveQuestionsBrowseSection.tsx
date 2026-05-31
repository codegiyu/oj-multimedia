import { ActiveQuestionsSection } from '@/components/section/community/ask-a-pastor/ActiveQuestionsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToQuestion } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { Question } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

type ActiveQuestionsBrowseSectionProps = {
  category: string;
  page: number;
};

export async function ActiveQuestionsBrowseSection({
  category,
  page,
}: ActiveQuestionsBrowseSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: {
      status: 'active',
      category: category && category !== 'all' ? category : undefined,
    },
  }) as `?${string}`;

  const res = await callPublicServerApi(
    'PUBLIC_GET_ASK_A_PASTOR_QUESTIONS',
    { query },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Active questions unavailable"
        message={res.error?.message ?? 'Failed to load questions'}
      />
    );
  }

  const activeQuestions = ((res.data?.questions ?? []) as unknown[]).map(i =>
    mapToQuestion(i as Record<string, unknown>)
  ) as Question[];

  return (
    <ActiveQuestionsSection
      questions={activeQuestions}
      pagination={res.data?.pagination ?? null}
      presentation="browse-list"
    />
  );
}
