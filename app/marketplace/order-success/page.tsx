import type { Metadata } from 'next';
import { OrderSuccessPageClient } from '@/components/section/marketplace/OrderSuccessPageClient';

export const metadata: Metadata = {
  title: 'Order Placed - Marketplace',
  description: 'Your order has been placed successfully.',
};

export default function OrderSuccessPage() {
  return <OrderSuccessPageClient />;
}
