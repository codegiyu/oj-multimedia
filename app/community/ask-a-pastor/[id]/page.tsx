import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuestionDetailPageClient } from '@/components/section/community/ask-a-pastor/QuestionDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToQuestionDetail } from '@/lib/utils/communityApiMappers';
import { RelatedQuestionsSection } from './_sections/RelatedQuestionsSection';
import { CommunityRelatedSectionSkeleton } from '@/app/community/_sections/detailSkeletons';

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchQuestionDetail(id: string) {
  return callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_QUESTION_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
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

  return (
    <MainLayout>
      <QuestionDetailPageClient
        question={question}
        relatedSlot={
          <Suspense fallback={<CommunityRelatedSectionSkeleton />}>
            <RelatedQuestionsSection id={id} category={question.category} />
          </Suspense>
        }
      />
    </MainLayout>
  );
}
