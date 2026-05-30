import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AccountFavoritesPageClient } from '@/components/section/account/AccountFavoritesPageClient';
import { AccountFavoritesPageSkeleton } from '@/components/section/account/skeletons';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Favorites',
  description: 'Your saved music, videos, and other content.',
};

export default function AccountFavoritesPage() {
  return (
    <Suspense fallback={<AccountFavoritesPageSkeleton />}>
      <AccountFavoritesPageClientServer />
    </Suspense>
  );
}

async function AccountFavoritesPageClientServer() {
  const res = await callServerApi('USER_FAVORITES_LIST', { query: '?page=1&limit=100' });

  if (res.type === 'error') {
    const responseCode = res.error?.responseCode;

    return (
      <AccountFavoritesPageClient
        initialItems={[]}
        initialPagination={{ page: 1, limit: 100, total: 0, totalPages: 1 }}
        initialLoadError={responseCode === 401 ? null : res.message || 'Unable to load favorites.'}
      />
    );
  }

  return (
    <AccountFavoritesPageClient
      initialItems={res.data.items}
      initialPagination={res.data.pagination}
      initialLoadError={null}
    />
  );
}
