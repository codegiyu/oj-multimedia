import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuestionDetailPageClient } from '@/components/section/community/ask-a-pastor/QuestionDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToQuestionDetail } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { QuestionItem } from '@/lib/constants/community/questions';

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchQuestionDetail(id: string) {
  return callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTION_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
}

async function fetchRelatedQuestions(id: string, category: string): Promise<QuestionItem[]> {
  const res = await callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTIONS', {
    query: buildCommunityListQuery({ status: 'active', limit: 12, category }),
  });

  if (res.type === 'error') return [];

  const rawList = (res.data?.questions ?? []) as unknown[];

  return rawList
    .map(i => mapToQuestionDetail(i as Record<string, unknown>))
    .filter(q => q._id !== id)
    .slice(0, 3);
}

export async function generateMetadata({ params }: QuestionDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Question Not Found',
      description: 'The requested question could not be found.',
    };
  }

  const res = await fetchQuestionDetail(id);

  if (res.type === 'error') {
    return {
      title: 'Question Not Found',
      description: 'The requested question could not be found.',
    };
  }

  const raw = res.data.question as unknown as Record<string, unknown>;
  const question = mapToQuestionDetail(raw);

  return {
    title: `${question.question} - Ask a Pastor`,
    description: question.fullQuestion || question.question,
  };
}

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) notFound();

  const res = await fetchQuestionDetail(id);

  if (res.type === 'error') notFound();

  const raw = res.data.question as unknown as Record<string, unknown>;
  const question = mapToQuestionDetail(raw);
  const relatedQuestions = await fetchRelatedQuestions(id, question.category);

  return (
    <MainLayout>
      <QuestionDetailPageClient question={question} relatedQuestions={relatedQuestions} />
    </MainLayout>
  );
}
