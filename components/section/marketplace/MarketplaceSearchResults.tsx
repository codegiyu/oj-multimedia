'use client';

import { Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ListPagination } from '@/components/general/ListPagination';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { IMarketplaceProduct } from '@/lib/constants/endpoints';

type MarketplaceSearchResultsProps = {
  products: IMarketplaceProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  hasQuery: boolean;
};

export function MarketplaceSearchResults({
  products,
  pagination,
  hasQuery,
}: MarketplaceSearchResultsProps) {
  if (products.length === 0) {
    return (
      <SectionEmptyState
        title={hasQuery ? 'No products match your filters' : 'Start your search'}
        description={
          hasQuery
            ? 'Try adjusting your search or filters to find products.'
            : 'Enter a search term or choose filters to find products.'
        }
        icon={Search}
        actionLabel="Browse all products"
        actionHref="/marketplace/products"
      />
    );
  }

  return (
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
  );
}
