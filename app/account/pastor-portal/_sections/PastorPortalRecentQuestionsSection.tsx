import { SectionLoadError } from '@/components/general/SectionLoadError';
import { PastorPortalRecentQuestionsPanel } from '@/components/section/account/pastor-portal/PastorPortalRecentQuestionsPanel';
import { getPastorQuestions } from '@/lib/services/pastorPortalData';
import { mapPastorQuestionListItem } from '@/lib/utils/pastorPortalMappers';

export async function PastorPortalRecentQuestionsSection() {
  const questionsRes = await getPastorQuestions('?limit=20&sort=-createdAt');

  if (questionsRes.type === 'error') {
    return (
      <SectionLoadError
        title="Questions unavailable"
        message={questionsRes.message || 'Unable to load recent questions.'}
      />
    );
  }

  const recentQuestions = (questionsRes.data.questions ?? []).map(q =>
    mapPastorQuestionListItem(q as unknown as Record<string, unknown>)
  );

  return <PastorPortalRecentQuestionsPanel recentQuestions={recentQuestions} />;
}
