'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { ProductCard } from './ProductCard';
import { Store, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { MarketplaceVendor } from '@/lib/utils/marketplace';
import { getMockProductsByVendorId } from '@/lib/utils/marketplace';

export interface VendorStorePageClientProps {
  vendor: MarketplaceVendor | null;
}

export function VendorStorePageClient({ vendor }: VendorStorePageClientProps) {
  if (!vendor) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Vendor not found</h1>
            <Link href="/marketplace/vendors" className="text-primary hover:underline">
              Back to vendors
            </Link>
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  const products = getMockProductsByVendorId(vendor._id);

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/marketplace/vendors" className="hover:text-primary">
              Vendors
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{vendor.storeName}</span>
          </nav>

          <Card className="p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.storeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-12 h-12 text-primary" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {vendor.storeName}
                </h1>
                {vendor.storeDescription && (
                  <p className="text-muted-foreground mb-4">{vendor.storeDescription}</p>
                )}
                {vendor.isVerified && (
                  <span className="inline-block text-sm font-medium text-primary">
                    Verified vendor
                  </span>
                )}
              </div>
            </div>
          </Card>

          <h2 className="text-xl font-semibold text-foreground mb-6">Products</h2>
          {products.length === 0 ? (
            <p className="text-muted-foreground">No products listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} showVendor={false} />
              ))}
            </div>
          )}
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
