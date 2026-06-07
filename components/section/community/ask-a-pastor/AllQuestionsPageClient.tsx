'use client';

import { useRouter } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { ContentAllBrowseStatusFilter } from '@/components/general/ContentAllBrowseStatusFilter';
import { ContentAllBrowseCategoryFilter } from '@/components/general/ContentAllBrowseCategoryFilter';
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
  const router = useRouter();
  const isEmpty =
    listKind === 'answered' ? answeredQuestions.length === 0 : activeQuestions.length === 0;

  if (initialErrorMessage && isEmpty) {
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

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config}>
          <ContentAllBrowseStatusFilter config={config} />
        </ContentAllBrowseToolbar>
      </SectionContainer>
      {config.categoryScope ? (
        <ContentAllBrowseCategoryFilter
          config={
            config as AllBrowseConfig & {
              categoryScope: NonNullable<AllBrowseConfig['categoryScope']>;
            }
          }
        />
      ) : null}
      {initialErrorMessage && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialErrorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </div>
      )}
      {listKind === 'answered' ? (
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
      )}
    </>
  );
}
