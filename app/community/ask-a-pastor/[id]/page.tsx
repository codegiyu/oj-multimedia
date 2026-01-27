import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuestionDetailPageClient } from '@/components/section/community/ask-a-pastor/QuestionDetailPageClient';
import { getQuestionById, getRelatedQuestions } from '@/lib/utils/community/questions';

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the question detail page
export async function generateMetadata({ params }: QuestionDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return {
      title: 'Question Not Found',
      description: 'The requested question could not be found.',
    };
  }

  const question = getQuestionById(id);

  if (!question) {
    return {
      title: 'Question Not Found',
      description: 'The requested question could not be found.',
    };
  }

  return {
    title: `${question.question} - Ask a Pastor`,
    description: question.fullQuestion || question.question,
  };
}

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  // Validate ID
  if (isNaN(id)) {
    notFound();
  }

  // Get question item
  const question = getQuestionById(id);

  // Return 404 if not found
  if (!question) {
    notFound();
  }

  // Get related questions
  const relatedQuestions = getRelatedQuestions(id, question.category, 3);

  return (
    <MainLayout>
      <QuestionDetailPageClient question={question} relatedQuestions={relatedQuestions} />
    </MainLayout>
  );
}
