import { SectionLoadError } from '@/components/general/SectionLoadError';
import {
  PastorIdProvider,
  PastorPortalQuestionsListPanel,
} from '@/components/section/account/pastor-portal/PastorPortalQuestionsListPanel';
import { getPastorMe, getPastorQuestions } from '@/lib/services/pastorPortalData';
import { mapPastorQuestionListItem } from '@/lib/utils/pastorPortalMappers';
import type { IPastorMeRes } from '@/lib/constants/endpoints';

export async function PastorPortalQuestionsListSection() {
  const meRes = await getPastorMe();
  const questionsRes = await getPastorQuestions('?limit=100&sort=-createdAt');

  if (questionsRes.type === 'error') {
    return (
      <SectionLoadError
        title="Questions unavailable"
        message={questionsRes.message || 'Unable to load questions.'}
      />
    );
  }

  const pastorId = meRes.type === 'success' ? ((meRes.data as IPastorMeRes).pastor?._id ?? '') : '';

  const initialQuestions = (questionsRes.data.questions ?? []).map(q =>
    mapPastorQuestionListItem(q as unknown as Record<string, unknown>)
  );

  return (
    <PastorIdProvider pastorId={pastorId}>
      <PastorPortalQuestionsListPanel initialQuestions={initialQuestions} />
    </PastorIdProvider>
  );
}
