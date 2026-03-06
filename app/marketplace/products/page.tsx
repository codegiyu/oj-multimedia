import type { Metadata } from 'next';
import { MarketplaceProductsPageClient } from '@/components/section/marketplace/MarketplaceProductsPageClient';

export const metadata: Metadata = {
  title: 'Products - Marketplace',
  description: 'Browse all products from our marketplace vendors. Filter by category.',
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function MarketplaceProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <MarketplaceProductsPageClient category={params.category} />;
}
