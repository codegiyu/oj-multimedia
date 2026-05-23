'use client';

import { useRouter } from 'next/navigation';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ListPagination } from '@/components/general/ListPagination';
import { Store } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/section/news/EmptyState';
import { FillImage } from '@/components/general/FillImage';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

export interface MarketplaceVendorsPageClientProps {
  vendors: IMarketplaceVendor[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  error: string | null;
}

export function MarketplaceVendorsPageClient({
  vendors = [],
  pagination,
  error = null,
}: MarketplaceVendorsPageClientProps) {
  const router = useRouter();

  if (error && vendors.length === 0) {
    return (
      <>
        <SectionContainer className="py-16 md:py-20">
          <DataLoadError
            title="Unable to load vendors"
            message={error}
            onRetry={() => router.refresh()}
            icon={<Store className="w-8 h-8 text-destructive" />}
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
            <span className="text-foreground">Vendors</span>
          </nav>

          <SectionHeader
            icon={Store}
            heading="Vendor Stores"
            subtext="Shop directly from individual vendor stores. Each store is run by verified sellers."
            className="mb-10"
          />

          {vendors.length === 0 ? (
            <EmptyState
              title="No vendor stores yet"
              description="Check back later for verified vendor stores to shop from."
              icon={<Store className="w-12 h-12 text-muted-foreground" />}
              actionLabel="Browse products"
              actionHref="/marketplace/products"
              showDefaultActions={false}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(vendor => (
                  <Link key={vendor._id} href={`/marketplace/vendors/${vendor.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="p-6">
                        <div className="relative w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                          {vendor.logo ? (
                            <FillImage src={vendor.logo} alt={vendor.storeName} sizes="80px" />
                          ) : (
                            <Store className="w-10 h-10 text-primary" />
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-foreground text-center mb-2 group-hover:text-primary transition-colors">
                          {vendor.storeName}
                        </h2>
                        {vendor.storeDescription && (
                          <p className="text-sm text-muted-foreground text-center line-clamp-3 mb-4">
                            {vendor.storeDescription}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground text-center">
                          {vendor.productCount ?? 0} products
                        </p>
                        {vendor.isVerified && (
                          <p className="text-xs text-primary font-medium text-center mt-2">
                            Verified
                          </p>
                        )}
                      </div>
                    </Card>
                  </Link>
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
    </>
  );
}
