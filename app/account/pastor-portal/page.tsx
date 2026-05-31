import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import type { IPastorDashboardStatsRes, IPastorMeRes } from '@/lib/constants/endpoints';
import { PastorPortalPageClient } from '@/components/section/account/pastor-portal/PastorPortalPageClient';
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

async function PastorOverviewServer() {
  const [statsRes, questionsRes, meRes] = await Promise.all([
    callServerApi('PASTOR_GET_DASHBOARD_STATS', {}),
    callServerApi('PASTOR_GET_QUESTIONS', { query: '?limit=20&sort=-createdAt' as `?${string}` }),
    callServerApi('PASTOR_GET_ME', {}),
  ]);

  const stats = statsRes.type === 'success' ? (statsRes.data as IPastorDashboardStatsRes) : null;
  const recentQuestions =
    questionsRes.type === 'success'
      ? (questionsRes.data.questions ?? []).map(q =>
          mapPastorQuestionListItem(q as unknown as Record<string, unknown>)
        )
      : [];
  const pastor = meRes.type === 'success' ? ((meRes.data as IPastorMeRes).pastor ?? null) : null;

  const errorMessage =
    statsRes.type === 'error' && questionsRes.type === 'error'
      ? (statsRes.message ?? 'Unable to load dashboard.')
      : statsRes.type === 'error'
        ? (statsRes.message ?? null)
        : questionsRes.type === 'error'
          ? (questionsRes.message ?? null)
          : null;

  return (
    <PastorPortalPageClient
      stats={stats}
      recentQuestions={recentQuestions}
      pastor={pastor}
      errorMessage={errorMessage}
    />
  );
}

export default function PastorPortalOverviewPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground p-6">Loading overview…</p>}>
      <PastorOverviewServer />
    </Suspense>
  );
}
