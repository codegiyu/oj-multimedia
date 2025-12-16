import type { Metadata } from 'next';
import { MarketplacePageClient } from '@/components/section/marketplace/MarketplacePageClient';

export const metadata: Metadata = {
  title: 'Marketplace - Shop Christian Products',
  description:
    'Shop from Christian vendors - fashion, food, health & beauty, accessories, and more.',
};

export default function MarketplacePage() {
  return <MarketplacePageClient />;
}
