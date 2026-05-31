import { Package } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { ProductCard } from '@/components/section/marketplace/ProductCard';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { MARKETPLACE_LANDING_PAGE_SIZE } from './shared';
import { marketplaceSectionEmptyIcon, marketplaceSectionHeaderIcon } from './sectionIcons';

export async function MarketplaceRecentProductsSection() {
  const res = await callPublicServerApi('MARKETPLACE_GET_PRODUCTS', {
    query: `?sort=recent&limit=${MARKETPLACE_LANDING_PAGE_SIZE}&status=published` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Recent products unavailable"
        message={res.error?.message ?? 'Failed to load recent products'}
      />
    );
  }

  const hotOrRecentProducts = res.data?.products ?? [];

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          iconSlot={marketplaceSectionHeaderIcon(Package)}
          heading="Recently Added"
          subtext="Latest from our vendors"
          viewAllLink="/marketplace/products?sort=recent"
          viewAllLabel="View all"
          className="mb-8"
        />
        {hotOrRecentProducts.length === 0 ? (
          <SectionEmptyState
            title="No recent products yet"
            description="Check back soon for new items from our vendors."
            iconSlot={marketplaceSectionEmptyIcon(Package)}
            actionLabel="View all products"
            actionHref="/marketplace/products"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotOrRecentProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
