import type { QuestionDetail } from '@/lib/types/community';

export function mapAccountCommunityQuestionDetail(item: Record<string, unknown>): QuestionDetail {
  const answersRaw = Array.isArray(item.answers) ? item.answers : [];

  return {
    _id: String(item._id ?? ''),
    question: String(item.question ?? ''),
    category: String(item.category ?? ''),
    author: String(item.author ?? ''),
    views: Number(item.views ?? 0),
    answers: answersRaw.length,
    answersCount: answersRaw.length,
    timeAgo: String(item.createdAt ?? ''),
    urgent: Boolean(item.urgent),
    status: String(item.status ?? 'active'),
    isPrivate: Boolean(item.isPrivate),
    isAnswered: Boolean(item.isAnswered) || answersRaw.length > 0,
    answersList: answersRaw.map((entry: unknown) => {
      const a = entry as Record<string, unknown>;
      const pastor =
        a.pastor && typeof a.pastor === 'object'
          ? (a.pastor as NonNullable<QuestionDetail['answersList']>[number]['pastor'])
          : null;

      return {
        _id: String(a._id ?? ''),
        answer: String(a.answer ?? ''),
        answeredAt: a.answeredAt != null ? String(a.answeredAt) : undefined,
        likes: Number(a.likes ?? 0),
        pastor,
      };
    }),
  };
}
