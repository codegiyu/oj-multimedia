'use client';

import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { ContentAllBrowseCategoryFilter } from '@/components/general/ContentAllBrowseCategoryFilter';
import { DailyDevotionalsSection } from './DailyDevotionalsSection';
import type { DailyDevotional } from './DevotionalsPageClient';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

interface AllDevotionalsPageClientProps {
  config: AllBrowseConfig;
  devotionals: DailyDevotional[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllDevotionalsPageClient({
  config,
  devotionals,
  pagination = null,
  initialErrorMessage = null,
}: AllDevotionalsPageClientProps) {
  const router = useRouter();

  if (initialErrorMessage && devotionals.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load devotionals"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<BookOpen className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config} />
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
      <DailyDevotionalsSection
        devotionals={devotionals}
        pagination={pagination}
        presentation="browse-list"
      />
    </>
  );
}
