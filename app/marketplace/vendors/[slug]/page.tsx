import type { Metadata } from 'next';
import { VendorStorePageClient } from '@/components/section/marketplace/VendorStorePageClient';
import { getMockVendorBySlug } from '@/lib/utils/marketplace';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = getMockVendorBySlug(slug);
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
  const vendor = getMockVendorBySlug(slug);
  return <VendorStorePageClient vendor={vendor} />;
}
