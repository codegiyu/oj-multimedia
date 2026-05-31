import { SectionLoadError } from '@/components/general/SectionLoadError';
import { AccountCommunityQuestionsPanel } from '@/components/section/account/community/AccountCommunityQuestionsPanel';
import { callServerApi } from '@/lib/services/serverApi';
import { mapAccountCommunityQuestionDetail } from '@/lib/utils/accountCommunityMappers';

export async function AccountCommunityQuestionsSection() {
  const res = await callServerApi('USER_ME_COMMUNITY_QUESTIONS', {
    query: '?limit=50' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Questions unavailable"
        message={res.message || 'Unable to load your questions.'}
      />
    );
  }

  const questions = (res.data.questions ?? []).map(q =>
    mapAccountCommunityQuestionDetail(q as unknown as Record<string, unknown>)
  );

  return <AccountCommunityQuestionsPanel questions={questions} />;
}
