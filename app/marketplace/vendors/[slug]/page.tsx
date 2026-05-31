import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';
import { VendorProfileSection } from './_sections/VendorProfileSection';
import { VendorProductsSection } from './_sections/VendorProductsSection';
import { VendorProfileSectionSkeleton, VendorProductsSectionSkeleton } from './_sections/skeletons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchVendorForMetadata(slug: string) {
  const vendorRes = await callPublicServerApi('MARKETPLACE_GET_VENDOR_BY_SLUG', {
    query: `/${encodeURIComponent(slug)}` as `/${string}`,
  });

  return vendorRes.type === 'success' ? (vendorRes.data ?? null) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await fetchVendorForMetadata(slug);
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

  return (
    <MainLayout>
      <Suspense fallback={<VendorProfileSectionSkeleton />}>
        <VendorProfileSection slug={slug} />
      </Suspense>
      <Suspense fallback={<VendorProductsSectionSkeleton />}>
        <VendorProductsSection slug={slug} />
      </Suspense>
    </MainLayout>
  );
}
