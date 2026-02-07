import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AskAPastorHero } from '@/components/section/community/ask-a-pastor/AskAPastorHero';
import {
  AskAPastorPageClient,
  type Question,
  type AnsweredQuestion,
  type AvailablePastor,
} from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';
import { QUESTIONS_ITEMS } from '@/lib/constants/community/questions';
import { PASTORS, type Pastor } from '@/lib/constants/community/pastors';

export const metadata: Metadata = {
  title: 'Ask a Pastor - Get Biblical Guidance',
  description:
    'Submit your questions to our pastors, browse answered questions, and get biblical guidance on faith, life, and spiritual matters.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate ask a pastor data from central constants
async function generateAskAPastorData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter and transform active questions
  const activeQuestions: Question[] = QUESTIONS_ITEMS.filter(item => item.isActive).map(item => ({
    _id: item._id,
    question: item.question,
    category: item.category,
    author: item.author,
    views: item.views,
    answers: item.answers,
    timeAgo: item.timeAgo,
    urgent: item.urgent,
  }));

  // Filter and transform answered questions
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

  // Transform available pastors
  const availablePastors: AvailablePastor[] = PASTORS.map((pastor: Pastor) => ({
    _id: pastor._id,
    name: pastor.name,
    title: pastor.title,
    church: pastor.church,
    image: pastor.image,
    expertise: (pastor.expertise || pastor.topics || []) as string[],
    questionsAnswered: pastor.questionsAnswered || 0,
    rating: pastor.rating || 0,
  }));

  // Calculate category counts
  const categoryCounts: Record<string, number> = {};
  QUESTIONS_ITEMS.forEach(item => {
    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });

  return {
    activeQuestions,
    answeredQuestions,
    availablePastors,
    categoryCounts,
  };
}

export default async function CommunityAskAPastorPage() {
  const askAPastorData = await generateAskAPastorData();

  return (
    <MainLayout>
      <AskAPastorHero />
      <Suspense fallback={<AskAPastorPageSkeleton />}>
        <AskAPastorPageClient {...askAPastorData} />
      </Suspense>
    </MainLayout>
  );
}
