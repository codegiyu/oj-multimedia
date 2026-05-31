import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { marketplaceSectionEmptyIcon, marketplaceSectionHeaderIcon } from './sectionIcons';

export async function MarketplaceCategoriesSection() {
  const res = await callPublicServerApi('MARKETPLACE_GET_CATEGORIES', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Categories unavailable"
        message={res.error?.message ?? 'Failed to load marketplace categories'}
      />
    );
  }

  const categories = res.data?.categories ?? [];

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          iconSlot={marketplaceSectionHeaderIcon(ShoppingBag)}
          heading="Shop by Category"
          subtext="Browse products by category"
        />
        {categories.length === 0 ? (
          <SectionEmptyState
            title="No categories yet"
            description="Check back later for product categories."
            iconSlot={marketplaceSectionEmptyIcon(ShoppingBag)}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.slug} href={`/marketplace/products?category=${cat.slug}`}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow group cursor-pointer">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Browse</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
