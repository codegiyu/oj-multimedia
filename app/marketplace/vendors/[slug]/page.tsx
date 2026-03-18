import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VendorStorePageClient } from '@/components/section/marketplace/VendorStorePageClient';
import { VendorStorePageSkeleton } from '@/components/section/marketplace/VendorStorePageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import type {
  IMarketplaceVendorRes,
  IMarketplaceProductsListRes,
  IMarketplaceVendor,
  IMarketplaceProduct,
} from '@/lib/constants/endpoints';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchVendorAndProducts(slug: string): Promise<{
  vendor: IMarketplaceVendor | null;
  products: IMarketplaceProduct[];
}> {
  const [vendorRes, productsRes] = await Promise.all([
    callServerApi('MARKETPLACE_GET_VENDOR_BY_SLUG', {
      query: `/${encodeURIComponent(slug)}` as `/${string}`,
    }),
    callServerApi('MARKETPLACE_GET_PRODUCTS', {
      query: `?vendor=${encodeURIComponent(slug)}&limit=100&status=published` as `?${string}`,
    }),
  ]);

  const vendor = (vendorRes.data as IMarketplaceVendorRes | undefined) ?? null;
  const products = (productsRes.data as IMarketplaceProductsListRes | undefined)?.products ?? [];
  return { vendor, products };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { vendor } = await fetchVendorAndProducts(slug);
  if (!vendor) {
    return { title: 'Vendor not found - Marketplace' };
  }
  return {
    title: `${vendor.storeName} - Marketplace`,
    description: vendor.storeDescription ?? `Shop from ${vendor.storeName} on our marketplace.`,
  };
}

export default async function VendorStorePage({ params }: PageProps) {
  const { slug } = await params;
  const { vendor, products } = await fetchVendorAndProducts(slug);

  return (
    <Suspense fallback={<VendorStorePageSkeleton />}>
      <VendorStorePageClient vendor={vendor} products={products} />
    </Suspense>
  );
}
