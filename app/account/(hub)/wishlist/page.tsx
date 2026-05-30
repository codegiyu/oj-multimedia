import { Suspense } from 'react';
import { AccountWishlistPageClient } from '@/components/section/account/AccountWishlistPageClient';
import { AccountWishlistPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved items and wishlist.',
};

export default function AccountWishlistPage() {
  return (
    <Suspense fallback={<AccountWishlistPageSkeleton />}>
      <AccountWishlistPageClientServer />
    </Suspense>
  );
}

async function AccountWishlistPageClientServer() {
  const res = await callServerApi('USER_WISHLIST_LIST', {});

  if (res.type === 'error') {
    const responseCode = res.error?.responseCode;
    return (
      <AccountWishlistPageClient
        initialItems={[]}
        initialPagination={{ page: 1, limit: 20, total: 0, totalPages: 1 }}
        initialLoadError={responseCode === 401 ? null : res.message || 'Unable to load wishlist.'}
      />
    );
  }

  return (
    <AccountWishlistPageClient
      initialItems={res.data.items}
      initialPagination={res.data.pagination}
      initialLoadError={null}
    />
  );
}
