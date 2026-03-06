import type { Metadata } from 'next';
import { BecomeVendorPageClient } from '@/components/section/marketplace/BecomeVendorPageClient';

export const metadata: Metadata = {
  title: 'Become a Vendor - Marketplace',
  description: 'Register to become a vendor and start selling your products on our marketplace.',
};

export default function BecomeVendorPage() {
  return <BecomeVendorPageClient />;
}
