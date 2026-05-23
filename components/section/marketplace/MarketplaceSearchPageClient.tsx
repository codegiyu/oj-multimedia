'use client';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { ProductCard } from './ProductCard';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ListPagination } from '@/components/general/ListPagination';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/section/news/EmptyState';
import { useQueryState, parseAsString } from 'nuqs';
import type {
  IMarketplaceCategory,
  IMarketplaceVendor,
  IMarketplaceProduct,
} from '@/lib/constants/endpoints';

export interface MarketplaceSearchPageClientProps {
  categories: IMarketplaceCategory[];
  vendors: IMarketplaceVendor[];
  products: IMarketplaceProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  error: string | null;
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'hot', label: 'Popular' },
] as const;

/** Reserved filter value so native `<option>` never uses `value=""` (invalid / fragile for controlled selects). */
const FILTER_ALL = '__all__';

function filterValueFromSelect(raw: string) {
  return raw === FILTER_ALL ? '' : raw;
}

export function MarketplaceSearchPageClient({
  categories = [],
  vendors = [],
  products = [],
  pagination,
  error = null,
}: MarketplaceSearchPageClientProps) {
  const router = useRouter();
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [vendor, setVendor] = useQueryState('vendor', parseAsString.withDefault(''));
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault('recent'));

  const handleSearch = (value: string) => {
    setQ(value || null).then(() => {
      setCategory(null);
      setVendor(null);
      router.refresh();
    });
  };

  const handleCategoryChange = (value: string) => {
    const next = filterValueFromSelect(value);
    setCategory(next || null).then(() => router.refresh());
  };

  const handleVendorChange = (value: string) => {
    const next = filterValueFromSelect(value);
    setVendor(next || null).then(() => router.refresh());
  };

  const handleSortChange = (value: string) => {
    setSort(value || null).then(() => router.refresh());
  };

  if (error && products.length === 0 && !q) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <DataLoadError
            title="Search unavailable"
            message={error}
            onRetry={() => router.refresh()}
            icon={<Search className="w-8 h-8 text-destructive" />}
          />
        </SectionContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
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
              onKeyDown={e =>
                e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)
              }
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
            <label htmlFor="mp-vendor" className="text-sm text-muted-foreground">
              Vendor:
            </label>
            <select
              id="mp-vendor"
              value={vendor || FILTER_ALL}
              onChange={e => handleVendorChange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option key={`vendor-${FILTER_ALL}`} value={FILTER_ALL}>
                All vendors
              </option>
              {vendors.map(v => (
                <option key={v._id} value={v.slug}>
                  {v.storeName}
                </option>
              ))}
            </select>
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

          {products.length === 0 ? (
            <EmptyState
              title={
                q || category || vendor ? 'No products match your filters' : 'Start your search'
              }
              description={
                q || category || vendor
                  ? 'Try adjusting your search or filters to find products.'
                  : 'Enter a search term or choose filters to find products.'
              }
              icon={<Search className="w-12 h-12 text-muted-foreground" />}
              actionLabel="Browse all products"
              actionHref="/marketplace/products"
              showDefaultActions={false}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
