import { SectionLoadError } from '@/components/general/SectionLoadError';
import { RelatedQuestionsGrid } from '@/components/section/community/ask-a-pastor/RelatedQuestionsGrid';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToQuestionDetail } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';

type RelatedQuestionsSectionProps = {
  id: string;
  category: string;
};

export async function RelatedQuestionsSection({ id, category }: RelatedQuestionsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTIONS', {
    query: buildCommunityListQuery({ status: 'active', limit: 12, category }),
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Related questions unavailable"
        message={res.error?.message ?? 'Failed to load related questions'}
      />
    );
  }

  const questions = ((res.data?.questions ?? []) as unknown[])
    .map(i => mapToQuestionDetail(i as Record<string, unknown>))
    .filter(q => q._id !== id)
    .slice(0, 3);

  return <RelatedQuestionsGrid questions={questions} />;
}
