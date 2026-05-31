import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { AccountCommunityQuestionDetailPageClient } from '@/components/section/account/community/AccountCommunityQuestionDetailPageClient';
import type { QuestionDetail } from '@/lib/types/community';

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

async function QuestionDetailServer({ id }: { id: string }) {
  const res = await callServerApi('USER_ME_COMMUNITY_QUESTION_ITEM', {
    query: `/${id}` as `/${string}`,
  });

  if (res.type === 'error') {
    if (res.error?.responseCode === 404) notFound();
    notFound();
  }

  const question = mapQuestionDetail(res.data.question as unknown as Record<string, unknown>);

  return <AccountCommunityQuestionDetailPageClient question={question} />;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountCommunityQuestionDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground p-6">Loading question…</p>}>
      <QuestionDetailServer id={id} />
    </Suspense>
  );
}
