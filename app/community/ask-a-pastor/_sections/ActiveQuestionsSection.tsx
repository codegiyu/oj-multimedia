import { ActiveQuestionsSection as ActiveQuestions } from '@/components/section/community/ask-a-pastor/ActiveQuestionsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToQuestion } from '@/lib/utils/communityApiMappers';
import type { Question } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

export async function ActiveQuestionsSection() {
  const res = await callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTIONS', {
    query: '?limit=50&page=1&status=active' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Active questions unavailable"
        message={res.error?.message ?? 'Failed to load active questions'}
      />
    );
  }

  const activeQuestions = ((res.data?.questions as unknown[]) ?? []).map(i =>
    mapToQuestion(i as Record<string, unknown>)
  ) as Question[];

  return <ActiveQuestions questions={activeQuestions} />;
}
