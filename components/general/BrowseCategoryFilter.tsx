'use client';

import { ContentAllBrowseCategoryFilter } from '@/components/general/ContentAllBrowseCategoryFilter';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';

export function BrowseCategoryFilter({ config }: { config: AllBrowseConfig }) {
  if (!config.categoryScope) {
    return null;
  }

  return (
    <ContentAllBrowseCategoryFilter
      config={
        config as AllBrowseConfig & {
          categoryScope: NonNullable<AllBrowseConfig['categoryScope']>;
        }
      }
    />
  );
}
