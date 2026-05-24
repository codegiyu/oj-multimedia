import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VendorStorePageClient } from '@/components/section/marketplace/VendorStorePageClient';
import { VendorStorePageSkeleton } from '@/components/section/marketplace/VendorStorePageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { IMarketplaceVendor, IMarketplaceProduct } from '@/lib/constants/endpoints';
import { MainLayout } from '@/components/layout/MainLayout';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchVendorAndProducts(slug: string): Promise<{
  vendor: IMarketplaceVendor | null;
  products: IMarketplaceProduct[];
}> {
  const [vendorRes, productsRes] = await Promise.all([
    callPublicServerApi('MARKETPLACE_GET_VENDOR_BY_SLUG', {
      query: `/${encodeURIComponent(slug)}` as `/${string}`,
    }),
    callPublicServerApi('MARKETPLACE_GET_PRODUCTS', {
      query: `?vendor=${encodeURIComponent(slug)}&limit=100&status=published` as `?${string}`,
    }),
  ]);

  const vendor = vendorRes.type === 'success' ? (vendorRes.data ?? null) : null;
  const products = productsRes.type === 'success' ? (productsRes.data?.products ?? []) : [];
  return { vendor, products };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { vendor } = await fetchVendorAndProducts(slug);
  if (!vendor) {
    return { title: 'Vendor not found - Marketplace' };
  }

  const title = `${vendor.storeName} - Marketplace`;
  const description =
    vendor.storeDescription ?? `Shop from ${vendor.storeName} on our marketplace.`;

  return buildDetailShareMetadata({
    title,
    description,
    path: `/marketplace/vendors/${slug}`,
    image: vendor.logo ?? vendor.coverImage,
    imageAlt: vendor.storeName,
  });
}

export default async function VendorStorePage({ params }: PageProps) {
  const { slug } = await params;
  const { vendor, products } = await fetchVendorAndProducts(slug);

  return (
    <MainLayout>
      <Suspense fallback={<VendorStorePageSkeleton />}>
        <VendorStorePageClient vendor={vendor} products={products} />
      </Suspense>
    </MainLayout>
  );
}
