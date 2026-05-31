'use client';

import { Package } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { ProductCard } from './ProductCard';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { IMarketplaceProduct } from '@/lib/constants/endpoints';

type VendorStoreProductsProps = {
  products: IMarketplaceProduct[];
};

export function VendorStoreProducts({ products }: VendorStoreProductsProps) {
  return (
    <SectionContainer className="pb-16 md:pb-20 pt-0">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-header mb-6">Products</h2>
        {products.length === 0 ? (
          <SectionEmptyState
            title="No products listed yet"
            description="This store has no products available. Check back later."
            icon={Package}
            actionLabel="Browse other vendors"
            actionHref="/marketplace/vendors"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} showVendor={false} />
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
