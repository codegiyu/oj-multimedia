import type { QuestionListItem } from '@/lib/types/community';

export type PastorQuestionTab = 'directed' | 'pool' | 'answered';

export function filterPastorQuestionsByTab(
  questions: QuestionListItem[],
  tab: PastorQuestionTab,
  pastorId: string
): QuestionListItem[] {
  if (tab === 'directed') {
    return questions.filter(q => {
      const requestedId =
        q.requestedPastor && typeof q.requestedPastor === 'object'
          ? q.requestedPastor._id
          : undefined;

      return requestedId === pastorId && q.status !== 'closed';
    });
  }

  if (tab === 'pool') {
    return questions.filter(q => {
      const requestedId =
        q.requestedPastor && typeof q.requestedPastor === 'object'
          ? q.requestedPastor._id
          : undefined;

      return !requestedId && q.status === 'active' && !q.isPrivate;
    });
  }

  return questions.filter(q => q.isAnswered || (q.answers ?? 0) > 0 || q.status === 'answered');
}
