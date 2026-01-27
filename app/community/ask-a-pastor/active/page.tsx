import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { ActiveQuestionsSection } from '@/components/section/community/ask-a-pastor/ActiveQuestionsSection';
import { filterByCategory } from '@/lib/utils/community/questions';
import { QUESTIONS_ITEMS } from '@/lib/constants/community/questions';
import type { Question } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';

export const metadata: Metadata = {
  title: 'Active Questions - Awaiting Answers',
  description:
    'Browse questions that are currently awaiting answers from our pastors. Submit your own question or pray for those seeking guidance.',
};

export const dynamic = 'force-dynamic';

async function generateActiveQuestionsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const activeQuestions: Question[] = QUESTIONS_ITEMS.filter(item => item.isActive).map(item => ({
    id: item.id,
    question: item.question,
    category: item.category,
    author: item.author,
    views: item.views,
    answers: item.answers,
    timeAgo: item.timeAgo,
    urgent: item.urgent,
  }));

  return {
    activeQuestions,
  };
}

interface ActiveQuestionsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ActiveQuestionsPage({ searchParams }: ActiveQuestionsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateActiveQuestionsData();

  const filteredData = {
    activeQuestions: filterByCategory(data.activeQuestions, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Active Questions"
        titleHighlight="Active"
        description="Browse questions that are currently awaiting answers from our pastors. Submit your own question or pray for those seeking guidance."
        badgeText="Awaiting Answers"
        badgeIcon="HelpCircle"
        backUrl="/community/ask-a-pastor"
        backLabel="Back to Ask a Pastor"
        stats={[{ icon: 'HelpCircle', text: 'Seeking guidance' }, { text: 'Pastor answered' }]}
      />
      <Suspense fallback={<AskAPastorPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <ActiveQuestionsSection questions={filteredData.activeQuestions} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
