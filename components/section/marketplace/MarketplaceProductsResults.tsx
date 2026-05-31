'use client';

import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { SectionHeader } from '@/components/general/SectionHeader';
import { ProductCard } from './ProductCard';
import { ListPagination } from '@/components/general/ListPagination';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { useQueryState, parseAsString } from 'nuqs';
import type { IMarketplaceProduct } from '@/lib/constants/endpoints';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'hot', label: 'Popular' },
] as const;

type MarketplaceProductsResultsProps = {
  products: IMarketplaceProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  categoryLabel?: string;
  activeCategorySlug?: string;
  initialSort?: string;
};

export function MarketplaceProductsResults({
  products,
  pagination,
  categoryLabel,
  activeCategorySlug,
  initialSort = 'recent',
}: MarketplaceProductsResultsProps) {
  const router = useRouter();
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(initialSort));

  const handleSortChange = (value: string) => {
    void setSort(value || null).then(() => router.refresh());
  };

  return (
    <>
      <SectionHeader
        icon={Package}
        heading={categoryLabel ?? activeCategorySlug ?? 'All Products'}
        subtext="Browse products from our vendors"
        extraButtons={
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={e => handleSortChange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        }
        className="mb-6"
      />

      {products.length === 0 ? (
        <SectionEmptyState
          title="No products in this category"
          description="Try a different category or check back later for new items."
          icon={Package}
          actionLabel="View all products"
          actionHref="/marketplace/products"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="mt-8">
            <ListPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
            />
          </div>
        </>
      )}
    </>
  );
}
