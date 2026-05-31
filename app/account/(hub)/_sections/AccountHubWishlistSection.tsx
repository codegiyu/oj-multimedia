import { SectionLoadError } from '@/components/general/SectionLoadError';
import { AccountHubWishlistPreview } from '@/components/section/account/AccountHubWishlistPreview';
import { AccountHubWishlistStatCard } from '@/components/section/account/AccountHubQuickLinks';
import { getAccountHubWishlist } from '@/lib/services/accountHubData';

export async function AccountHubWishlistStatSection() {
  const wishlistRes = await getAccountHubWishlist();

  if (wishlistRes.type === 'error') {
    return null;
  }

  const wishlistTotal = wishlistRes.data.pagination?.total ?? wishlistRes.data.items.length;

  return <AccountHubWishlistStatCard total={wishlistTotal} />;
}

export async function AccountHubWishlistSection() {
  const wishlistRes = await getAccountHubWishlist();

  if (wishlistRes.type === 'error') {
    return (
      <SectionLoadError
        title="Wishlist unavailable"
        message={wishlistRes.message || 'Unable to load your wishlist.'}
      />
    );
  }

  const wishlistPreview = wishlistRes.data.items.slice(0, 4);

  return <AccountHubWishlistPreview wishlistPreview={wishlistPreview} />;
}
