import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { AccountCommunityPageClient } from '@/components/section/account/community/AccountCommunityPageClient';
import type {
  QuestionDetail,
  TestimonyDetail,
  PrayerRequestDetail,
  PollListItem,
} from '@/lib/types/community';
import { mapToPoll } from '@/lib/utils/communityApiMappers';

function mapQuestionDetail(item: Record<string, unknown>): QuestionDetail {
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

async function AccountCommunityServer() {
  const [questionsRes, testimoniesRes, prayerRes, pollsRes] = await Promise.all([
    callServerApi('USER_ME_COMMUNITY_QUESTIONS', { query: '?limit=50' as `?${string}` }),
    callServerApi('USER_ME_COMMUNITY_TESTIMONIES', { query: '?limit=50' as `?${string}` }),
    callServerApi('USER_ME_COMMUNITY_PRAYER_REQUESTS', { query: '?limit=50' as `?${string}` }),
    callServerApi('USER_ME_COMMUNITY_POLLS', { query: '?limit=50' as `?${string}` }),
  ]);

  const questions =
    questionsRes.type === 'success'
      ? (questionsRes.data.questions ?? []).map(q =>
          mapQuestionDetail(q as unknown as Record<string, unknown>)
        )
      : [];
  const testimonies =
    testimoniesRes.type === 'success'
      ? ((testimoniesRes.data.testimonies as TestimonyDetail[]) ?? [])
      : [];
  const prayerRequests =
    prayerRes.type === 'success'
      ? ((prayerRes.data.prayerRequests as PrayerRequestDetail[]) ?? [])
      : [];

  const polls: PollListItem[] =
    pollsRes.type === 'success'
      ? (pollsRes.data.polls ?? []).map(p => mapToPoll(p as unknown as Record<string, unknown>))
      : [];

  const errorMessage = [questionsRes, testimoniesRes, prayerRes, pollsRes].every(
    r => r.type === 'error'
  )
    ? questionsRes.type === 'error'
      ? (questionsRes.message ?? 'Unable to load community data.')
      : null
    : null;

  return (
    <AccountCommunityPageClient
      questions={questions}
      testimonies={testimonies}
      prayerRequests={prayerRequests}
      polls={polls}
      errorMessage={errorMessage}
    />
  );
}

export default function AccountCommunityPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground p-6">Loading community…</p>}>
      <AccountCommunityServer />
    </Suspense>
  );
}
