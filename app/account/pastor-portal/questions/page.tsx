import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import type { IPastorMeRes } from '@/lib/constants/endpoints';
import { PastorPortalQuestionsPageClient } from '@/components/section/account/pastor-portal/PastorPortalQuestionsPageClient';
import type { QuestionListItem } from '@/lib/types/community';

function mapPastorQuestionListItem(item: Record<string, unknown>): QuestionListItem {
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

async function PastorQuestionsServer() {
  const [questionsRes, meRes] = await Promise.all([
    callServerApi('PASTOR_GET_QUESTIONS', { query: '?limit=100&sort=-createdAt' as `?${string}` }),
    callServerApi('PASTOR_GET_ME', {}),
  ]);

  const initialQuestions =
    questionsRes.type === 'success'
      ? (questionsRes.data.questions ?? []).map(q =>
          mapPastorQuestionListItem(q as unknown as Record<string, unknown>)
        )
      : [];
  const pastor = meRes.type === 'success' ? ((meRes.data as IPastorMeRes).pastor ?? null) : null;

  return (
    <PastorPortalQuestionsPageClient
      initialQuestions={initialQuestions}
      pastor={pastor}
      errorMessage={questionsRes.type === 'error' ? (questionsRes.message ?? null) : null}
    />
  );
}

export default function PastorPortalQuestionsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground p-6">Loading questions…</p>}>
      <PastorQuestionsServer />
    </Suspense>
  );
}
