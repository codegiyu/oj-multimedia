import type { Metadata } from 'next';
import { MarketplaceVendorsPageClient } from '@/components/section/marketplace/MarketplaceVendorsPageClient';

export const metadata: Metadata = {
  title: 'Vendors - Marketplace',
  description: 'Browse vendor stores on our marketplace. Shop directly from verified sellers.',
};

export default function MarketplaceVendorsPage() {
  return <MarketplaceVendorsPageClient />;
}
