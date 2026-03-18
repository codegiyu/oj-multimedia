'use client';

import { useRouter } from 'next/navigation';
import { ActiveQuestionsSection } from './ActiveQuestionsSection';
import { SubmitQuestionSection } from './SubmitQuestionSection';
import { AnsweredQuestionsSection } from './AnsweredQuestionsSection';
import { AvailablePastorsSection } from './AvailablePastorsSection';
import { QuestionCategoriesSection } from './QuestionCategoriesSection';
import { CommunityCTA } from '../../shared';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { HelpCircle } from 'lucide-react';

export interface Question {
  _id: string;
  question: string;
  category: string;
  author: string;
  views: number;
  answers: number;
  timeAgo: string;
  urgent: boolean;
}

export interface AnsweredQuestion {
  _id: string;
  question: string;
  answer: string;
  pastor: string;
  category: string;
  answeredDate: string;
  helpful: number;
}

export interface AvailablePastor {
  _id: string;
  name: string;
  title: string;
  church: string;
  image: string;
  expertise: string[];
  questionsAnswered: number;
  rating: number;
}

export interface QuestionCategory {
  name: string;
  count: number;
}

// Static category definitions - hardcoded on the client side
const categoryDefinitions: Omit<QuestionCategory, 'count'>[] = [
  { name: 'Faith' },
  { name: 'Relationships' },
  { name: 'Spiritual Growth' },
  { name: 'Finance' },
  { name: 'Bible Study' },
  { name: 'Prayer' },
];

interface AskAPastorPageClientProps {
  activeQuestions: Question[];
  answeredQuestions: AnsweredQuestion[];
  availablePastors: AvailablePastor[];
  categoryCounts: Record<string, number>;
  initialErrorMessage?: string | null;
}

export const AskAPastorPageClient = ({
  activeQuestions,
  answeredQuestions,
  availablePastors,
  categoryCounts,
  initialErrorMessage = null,
}: AskAPastorPageClientProps) => {
  const router = useRouter();
  const hasAnyContent =
    activeQuestions.length > 0 || answeredQuestions.length > 0 || availablePastors.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load questions"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<HelpCircle className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  // Merge static category definitions with dynamic counts from server
  const categories: QuestionCategory[] = categoryDefinitions.map(def => ({
    name: def.name,
    count: categoryCounts[def.name] ?? 0,
  }));

  return (
    <>
      <ActiveQuestionsSection questions={activeQuestions} />
      <SubmitQuestionSection />
      <AnsweredQuestionsSection questions={answeredQuestions} />
      <AvailablePastorsSection pastors={availablePastors} />
      <QuestionCategoriesSection categories={categories} />
      <CommunityCTA />
    </>
  );
};
