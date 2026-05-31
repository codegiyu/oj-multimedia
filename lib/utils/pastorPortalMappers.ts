import type { QuestionListItem } from '@/lib/types/community';

export function mapPastorQuestionListItem(item: Record<string, unknown>): QuestionListItem {
  return {
    _id: String(item._id ?? ''),
    question: String(item.question ?? ''),
    category: String(item.category ?? ''),
    author: String(item.author ?? ''),
    views: Number(item.views ?? 0),
    answers: Number(item.answersCount ?? item.answers ?? 0),
    answersCount: Number(item.answersCount ?? item.answers ?? 0),
    timeAgo: String(item.createdAt ?? ''),
    urgent: Boolean(item.urgent),
    isAnswered: Boolean(item.isAnswered),
    isPrivate: Boolean(item.isPrivate),
    status: item.status != null ? String(item.status) : undefined,
    upvotes: Number(item.upvotes ?? 0),
    downvotes: Number(item.downvotes ?? 0),
    requestedPastor:
      item.requestedPastor && typeof item.requestedPastor === 'object'
        ? (item.requestedPastor as QuestionListItem['requestedPastor'])
        : undefined,
  };
}
