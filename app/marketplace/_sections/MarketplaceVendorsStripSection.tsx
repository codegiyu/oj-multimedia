import Link from 'next/link';
import { Store } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { FillImage } from '@/components/general/FillImage';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mergeFeaturedAndFallbackVendors } from '@/lib/utils/marketplaceVendorsStrip';
import { marketplaceSectionEmptyIcon, marketplaceSectionHeaderIcon } from './sectionIcons';

const STRIP_LIMIT = 3;

export async function MarketplaceVendorsStripSection() {
  const [featuredRes, allRes] = await Promise.all([
    callPublicServerApi('MARKETPLACE_GET_VENDORS', {
      query: `?featured=true&limit=${STRIP_LIMIT}` as `?${string}`,
    }),
    callPublicServerApi('MARKETPLACE_GET_VENDORS', {
      query: `?limit=6` as `?${string}`,
    }),
  ]);

  if (featuredRes.type === 'error' && allRes.type === 'error') {
    return (
      <SectionLoadError
        title="Vendor stores unavailable"
        message={featuredRes.error?.message ?? 'Failed to load vendor stores'}
      />
    );
  }

  const featured = featuredRes.type === 'success' ? (featuredRes.data?.vendors ?? []) : [];
  const all = allRes.type === 'success' ? (allRes.data?.vendors ?? []) : [];
  const vendors = mergeFeaturedAndFallbackVendors(featured, all, STRIP_LIMIT);

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          iconSlot={marketplaceSectionHeaderIcon(Store)}
          heading="Vendor Stores"
          subtext="Shop directly from individual stores"
          viewAllLink="/marketplace/vendors"
          viewAllLabel="View all stores"
          className="mb-8"
        />
        {vendors.length === 0 ? (
          <SectionEmptyState
            title="No vendor stores yet"
            description="Check back later for vendor stores to shop from."
            iconSlot={marketplaceSectionEmptyIcon(Store)}
            actionLabel="Browse products"
            actionHref="/marketplace/products"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendors.map(vendor => (
              <Link key={vendor._id} href={`/marketplace/vendors/${vendor.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6 text-center">
                    <div className="relative w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 overflow-hidden">
                      <FillImage
                        src={vendor.logo ?? ''}
                        alt={vendor.storeName}
                        imageContext="public"
                        sizes="80px"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {vendor.storeName}
                    </h3>
                    {vendor.storeDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {vendor.storeDescription}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {vendor.productCount ?? 0} products
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
