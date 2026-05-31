'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import type { IMarketplaceCategory } from '@/lib/constants/endpoints';

const FILTER_ALL = '__all__';

function filterValueFromSelect(raw: string) {
  return raw === FILTER_ALL ? '' : raw;
}

type MarketplaceSearchCategoryFilterProps = {
  categories: IMarketplaceCategory[];
};

export function MarketplaceSearchCategoryFilter({
  categories,
}: MarketplaceSearchCategoryFilterProps) {
  const router = useRouter();
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));

  const handleCategoryChange = (value: string) => {
    const next = filterValueFromSelect(value);
    void setCategory(next || null).then(() => router.refresh());
  };

  return (
    <>
      <label htmlFor="mp-category" className="text-sm text-muted-foreground">
        Category:
      </label>
      <select
        id="mp-category"
        value={category || FILTER_ALL}
        onChange={e => handleCategoryChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option key={FILTER_ALL} value={FILTER_ALL}>
          All categories
        </option>
        {categories.map(cat => (
          <option key={cat._id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </>
  );
}
