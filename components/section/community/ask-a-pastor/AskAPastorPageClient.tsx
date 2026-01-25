'use client';

import { ActiveQuestionsSection } from './ActiveQuestionsSection';
import { SubmitQuestionSection } from './SubmitQuestionSection';
import { AnsweredQuestionsSection } from './AnsweredQuestionsSection';
import { AvailablePastorsSection } from './AvailablePastorsSection';
import { QuestionCategoriesSection } from './QuestionCategoriesSection';
import { CommunityCTA } from '../../shared';

export interface Question {
  id: number;
  question: string;
  category: string;
  author: string;
  views: number;
  answers: number;
  timeAgo: string;
  urgent: boolean;
}

export interface AnsweredQuestion {
  id: number;
  question: string;
  answer: string;
  pastor: string;
  category: string;
  answeredDate: string;
  helpful: number;
}

export interface AvailablePastor {
  id: number;
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
}

export const AskAPastorPageClient = ({
  activeQuestions,
  answeredQuestions,
  availablePastors,
  categoryCounts,
}: AskAPastorPageClientProps) => {
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
