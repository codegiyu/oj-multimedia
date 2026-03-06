import type { Metadata } from 'next';
import { CheckoutPageClient } from '@/components/section/marketplace/CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Checkout - Marketplace',
  description: 'Complete your order. Enter contact and delivery details.',
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
