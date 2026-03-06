import { MainLayout } from '@/components/layout/MainLayout';
import { AccountWishlistPageClient } from '@/components/section/account/AccountWishlistPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved items and wishlist.',
};

export default function AccountWishlistPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <AccountWishlistPageClient />
    </MainLayout>
  );
}
