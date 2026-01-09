import type { Metadata } from 'next';
import { MarketplacePageClient } from '@/components/section/marketplace/MarketplacePageClient';

export const metadata: Metadata = {
  title: 'Marketplace - Shop Products & Services',
  description:
    'Shop from verified vendors - fashion, food, health & beauty, accessories, digital products, and more. Discover unique products and services.',
};

export default function MarketplacePage() {
  return <MarketplacePageClient />;
}
