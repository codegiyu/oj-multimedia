'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { useQueryState, parseAsString } from 'nuqs';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'hot', label: 'Popular' },
] as const;

type MarketplaceSearchLayoutProps = {
  categoryFilter: ReactNode;
  vendorFilter: ReactNode;
  results: ReactNode;
};

export function MarketplaceSearchLayout({
  categoryFilter,
  vendorFilter,
  results,
}: MarketplaceSearchLayoutProps) {
  const router = useRouter();
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault('recent'));

  const handleSearch = (value: string) => {
    void setQ(value || null).then(() => router.refresh());
  };

  const handleSortChange = (value: string) => {
    void setSort(value || null).then(() => router.refresh());
  };

  return (
    <SectionContainer className="marketplace-page-top">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-primary">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-foreground">Search</span>
        </nav>

        <SectionHeader
          icon={Search}
          heading="Search Marketplace"
          subtext="Find products by keyword, category, or vendor"
          className="mb-8"
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="search"
            placeholder="Search products..."
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

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {categoryFilter}
          {vendorFilter}
          <label htmlFor="mp-sort" className="text-sm text-muted-foreground">
            Sort:
          </label>
          <select
            id="mp-sort"
            value={sort}
            onChange={e => handleSortChange(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {results}
      </div>
    </SectionContainer>
  );
}
