'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';

type ContentAllBrowseToolbarProps = {
  config: AllBrowseConfig;
  children?: ReactNode;
};

export function ContentAllBrowseToolbar({ config, children }: ContentAllBrowseToolbarProps) {
  const router = useRouter();
  const defaultSort = config.sortOptions[0]?.value ?? 'newest';
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(defaultSort));
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const refreshFromPageOne = async (update: () => Promise<unknown>) => {
    await update();
    await setPage(1);
    router.refresh();
  };

  const handleSearch = (value: string) => {
    void refreshFromPageOne(() => setQ(value || null));
  };

  const handleSortChange = (value: string) => {
    void refreshFromPageOne(() => setSort(value || null));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder={config.searchPlaceholder}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
          className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={() => handleSearch(q)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Search
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {children}
        <label htmlFor={`${config.contentKey}-sort`} className="text-sm text-muted-foreground">
          Sort:
        </label>
        <select
          id={`${config.contentKey}-sort`}
          value={sort}
          onChange={e => handleSortChange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          {config.sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
