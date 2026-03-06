import type { Metadata } from 'next';
import { OrdersPageClient } from '@/components/section/marketplace/OrdersPageClient';

export const metadata: Metadata = {
  title: 'My Orders - Marketplace',
  description: 'View your marketplace order history.',
};

export default function MarketplaceOrdersPage() {
  return <OrdersPageClient />;
}
