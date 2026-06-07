import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { PastorQuestionDetailSkeleton } from '@/components/section/account/skeletons';
import { PastorPortalQuestionDetailPageClient } from '@/components/section/account/pastor-portal/PastorPortalQuestionDetailPageClient';
import type { QuestionDetail } from '@/lib/types/community';

function mapPastorQuestionDetail(item: Record<string, unknown>): QuestionDetail {
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
    isAnswered: Boolean(item.isAnswered) || answersRaw.length > 0,
    isPrivate: Boolean(item.isPrivate),
    upvotes: Number(item.upvotes ?? 0),
    downvotes: Number(item.downvotes ?? 0),
    answersList: answersRaw.map((entry: unknown) => {
      const a = entry as Record<string, unknown>;
      const pastor =
        a.pastor && typeof a.pastor === 'object'
          ? (a.pastor as QuestionDetail['answersList'] extends Array<infer T> ? T : never)
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

async function PastorQuestionDetailServer({ id }: { id: string }) {
  const res = await callServerApi('PASTOR_GET_QUESTION_ITEM', { query: `/${id}` as `/${string}` });

  if (res.type === 'error') {
    if (res.error?.responseCode === 404) notFound();

    return (
      <PastorPortalQuestionDetailPageClient
        question={mapPastorQuestionDetail({ _id: id, question: '', author: '', status: 'active' })}
        errorMessage={res.message ?? 'Unable to load question.'}
      />
    );
  }

  const question = mapPastorQuestionDetail(res.data.question as unknown as Record<string, unknown>);

  return <PastorPortalQuestionDetailPageClient question={question} errorMessage={null} />;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastorPortalQuestionDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<PastorQuestionDetailSkeleton />}>
      <PastorQuestionDetailServer id={id} />
    </Suspense>
  );
}
