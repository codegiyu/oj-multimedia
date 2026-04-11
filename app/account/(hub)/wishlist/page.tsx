import { Suspense } from 'react';
import { AccountWishlistPageClient } from '@/components/section/account/AccountWishlistPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved items and wishlist.',
};

function AccountWishlistPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-32 rounded-md" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

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
