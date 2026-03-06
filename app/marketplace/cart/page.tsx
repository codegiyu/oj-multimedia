import type { Metadata } from 'next';
import { CartPageClient } from '@/components/section/marketplace/CartPageClient';

export const metadata: Metadata = {
  title: 'Cart - Marketplace',
  description: 'Review your cart and proceed to checkout.',
};

export default function CartPage() {
  return <CartPageClient />;
}
