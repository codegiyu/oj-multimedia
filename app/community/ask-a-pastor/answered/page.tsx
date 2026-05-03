import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { AnsweredQuestionsSection } from '@/components/section/community/ask-a-pastor/AnsweredQuestionsSection';
import { filterByCategory } from '@/lib/utils/community/questions';
import { QUESTIONS_ITEMS } from '@/lib/constants/community/questions';
import type { AnsweredQuestion } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

export const metadata: Metadata = {
  title: 'Answered Questions - Biblical Guidance',
  description:
    'Browse answered questions from our pastors. Get biblical guidance on faith, life, and spiritual matters.',
};

async function generateAnsweredQuestionsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const answeredQuestions: AnsweredQuestion[] = QUESTIONS_ITEMS.filter(
    item => item.isAnswered && item.answer !== undefined && item.pastor !== undefined
  ).map(item => ({
    _id: item._id,
    question: item.question,
    answer: item.answer!,
    pastor: item.pastor!,
    category: item.category,
    answeredDate: item.answeredDate || '',
    helpful: item.helpful || 0,
  }));

  return {
    answeredQuestions,
  };
}

interface AnsweredQuestionsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AnsweredQuestionsPage({ searchParams }: AnsweredQuestionsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateAnsweredQuestionsData();

  const filteredData = {
    answeredQuestions: filterByCategory(data.answeredQuestions, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Answered Questions"
        titleHighlight="Answered"
        description="Browse questions that have been answered by our pastors. Get biblical guidance on faith, life, and spiritual matters."
        badgeText="Biblical Answers"
        badgeIcon="HelpCircle"
        backUrl="/community/ask-a-pastor"
        backLabel="Back to Ask a Pastor"
        stats={[{ icon: 'HelpCircle', text: 'Pastor answered' }, { text: 'Biblical guidance' }]}
      />
      <Suspense fallback={<AskAPastorPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <AnsweredQuestionsSection questions={filteredData.answeredQuestions} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
