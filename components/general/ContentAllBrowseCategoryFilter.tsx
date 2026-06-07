'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { Filter } from 'lucide-react';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { IContentCategoryItem } from '@/lib/constants/endpoints';
import { useContentCategoryOptions } from '@/lib/hooks/useContentCategoryOptions';

type ContentAllBrowseCategoryFilterProps = {
  config: AllBrowseConfig & {
    categoryScope: NonNullable<AllBrowseConfig['categoryScope']>;
  };
};

export function ContentAllBrowseCategoryFilter({ config }: ContentAllBrowseCategoryFilterProps) {
  const router = useRouter();
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault('all'));
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const { options } = useContentCategoryOptions({
    scope: config.categoryScope as IContentCategoryItem['scope'],
    includeAllOption: true,
    allLabel: 'All',
  });

  const handleChange = async (value: string) => {
    await setCategory(value === 'all' ? null : value);
    await setPage(1);
    router.refresh();
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          <Filter className="w-4 h-4" />
          Category:
        </span>
        {options.map((option, index) => (
          <button
            key={`${option.value}-${index}`}
            type="button"
            onClick={() => void handleChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              category === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
