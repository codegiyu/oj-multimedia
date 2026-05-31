/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useRouter } from 'next/navigation';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { ProductCard } from './ProductCard';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ListPagination } from '@/components/general/ListPagination';
import { Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import type {
  IMarketplaceCategory,
  IMarketplaceSubCategory,
  IMarketplaceProduct,
} from '@/lib/constants/endpoints';

export interface MarketplaceProductsPageClientProps {
  categories: IMarketplaceCategory[];
  subcategories: IMarketplaceSubCategory[];
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

export function MarketplaceProductsPageClient({
  categories = [],
  subcategories = [],
  products = [],
  pagination,
  error = null,
}: MarketplaceProductsPageClientProps) {
  const router = useRouter();
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault('recent'));
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));

  const activeCategorySlug = category || undefined;
  const categoryLabel =
    activeCategorySlug && categories.find(c => c.slug === activeCategorySlug)?.name;

  const handleSortChange = (value: string) => {
    setSort(value || null).then(() => router.refresh());
  };

  if (error && products.length === 0 && categories.length === 0) {
    return (
      <>
        <SectionContainer className="py-16 md:py-20">
          <DataLoadError
            title="Unable to load products"
            message={error}
            onRetry={() => router.refresh()}
            icon={<ShoppingBag className="w-8 h-8 text-destructive" />}
          />
        </SectionContainer>
      </>
    );
  }

  return (
    <>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-foreground">
              {categoryLabel ?? activeCategorySlug ?? 'All Products'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-56 shrink-0">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/marketplace/products"
                    className={`block py-2 px-3 rounded-lg transition-colors ${
                      !activeCategorySlug
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}>
                    All Products
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link
                      href={`/marketplace/products?category=${cat.slug}&page=1`}
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        activeCategorySlug === cat.slug
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      }`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="flex-1">
              <SectionHeader
                icon={Package}
                heading={categoryLabel ?? activeCategorySlug ?? 'All Products'}
                subtext="Browse products from our vendors"
                extraButtons={
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="sort"
                      className="text-sm text-muted-foreground whitespace-nowrap">
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
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
