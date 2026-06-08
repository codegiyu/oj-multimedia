'use client';

import { HelpCircle } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { BrowseCategoryFilter } from '@/components/general/BrowseCategoryFilter';
import { ContentAllBrowseStatusFilter } from '@/components/general/ContentAllBrowseStatusFilter';
import { ActiveQuestionsSection } from './ActiveQuestionsSection';
import { AnsweredQuestionsSection } from './AnsweredQuestionsSection';
import type { AnsweredQuestion, Question } from './AskAPastorPageClient';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

interface AllQuestionsPageClientProps {
  config: AllBrowseConfig;
  listKind: 'active' | 'answered';
  activeQuestions: Question[];
  answeredQuestions: AnsweredQuestion[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllQuestionsPageClient({
  config,
  listKind,
  activeQuestions,
  answeredQuestions,
  pagination = null,
  initialErrorMessage = null,
}: AllQuestionsPageClientProps) {
  const items = listKind === 'answered' ? answeredQuestions : activeQuestions;

  return (
    <BrowseListPageClient<Question | AnsweredQuestion>
      config={config}
      items={items}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load questions"
      errorIcon={<HelpCircle className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No questions found',
        description: 'Try adjusting your search or filters, or check back later.',
        icon: HelpCircle,
        showDefaultActions: true,
      }}
      toolbarChildren={<ContentAllBrowseStatusFilter config={config} />}
      afterToolbar={<BrowseCategoryFilter config={config} />}
      renderListBody={() =>
        listKind === 'answered' ? (
          <AnsweredQuestionsSection
            questions={answeredQuestions}
            pagination={pagination}
            presentation="browse-list"
          />
        ) : (
          <ActiveQuestionsSection
            questions={activeQuestions}
            pagination={pagination}
            presentation="browse-list"
          />
        )
      }
    />
  );
}
