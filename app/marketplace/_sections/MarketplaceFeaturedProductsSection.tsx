import { Package } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { ProductCard } from '@/components/section/marketplace/ProductCard';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { MARKETPLACE_LANDING_PAGE_SIZE } from './shared';

export async function MarketplaceFeaturedProductsSection() {
  const res = await callPublicServerApi('MARKETPLACE_GET_PRODUCTS', {
    query: `?featured=true&limit=${MARKETPLACE_LANDING_PAGE_SIZE}&status=published` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Featured products unavailable"
        message={res.error?.message ?? 'Failed to load featured products'}
      />
    );
  }

  const featuredProducts = res.data?.products ?? [];

  return (
    <SectionContainer className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={Package}
          heading="Featured Products"
          subtext="Handpicked from our vendors"
          viewAllLink="/marketplace/products"
          viewAllLabel="View all products"
          className="mb-8"
        />
        {featuredProducts.length === 0 ? (
          <SectionEmptyState
            title="No featured products yet"
            description="Browse all products below for great finds."
            icon={Package}
            actionLabel="View all products"
            actionHref="/marketplace/products"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
