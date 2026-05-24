'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/marketplace';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { IUserWishlistItem } from '@/lib/constants/endpoints';
import { toast } from 'sonner';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FillImage } from '@/components/general/FillImage';

export interface AccountWishlistPageClientProps {
  initialItems: IUserWishlistItem[];
  initialPagination: { page: number; limit: number; total: number; totalPages: number };
  initialLoadError: string | null;
}

export function AccountWishlistPageClient({
  initialItems,
  initialPagination: _initialPagination,
  initialLoadError,
}: AccountWishlistPageClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<IUserWishlistItem[]>(initialItems);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (item: IUserWishlistItem) => {
    setRemovingId(item._id);
    const { error, message } = await callApi('USER_WISHLIST_REMOVE', {
      query: `/${item.product._id}`,
    });
    setRemovingId(null);
    if (error) {
      toast.error(message || 'Failed to remove from wishlist.');
      return;
    }
    toast.success('Removed from wishlist.');
    setItems(prev => prev.filter(i => i._id !== item._id));
  };

  if (initialLoadError) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title="My wishlist" description="Items you've saved for later" />
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{initialLoadError}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/marketplace">Browse marketplace</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        <DashboardPageHeader title="My wishlist" description="Items you've saved for later" />
        <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card px-6 py-12 text-center shadow-sm">
          <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            You do not have any saved items yet. Explore the marketplace to add products you love.
          </p>
          <Button asChild className="mt-6 rounded-full bg-primary hover:bg-primary/90">
            <Link href="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader title="My wishlist" description="Items you've saved for later">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/marketplace">Continue shopping</Link>
        </Button>
      </DashboardPageHeader>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => {
          const imageUrl = item.product.images?.[0];
          const vendor = item.product.vendor;
          const inStock = (item.product as { inStock?: boolean }).inStock !== false;
          return (
            <Card
              key={item._id}
              className={cn(
                'gap-0 overflow-hidden border-border/80 py-0 shadow-sm',
                !inStock && 'opacity-80'
              )}>
              <div className="relative aspect-square bg-muted">
                <FillImage
                  src={imageUrl ?? ''}
                  alt={`${item.product.name} preview`}
                  imageContext="dashboard"
                  sizes="(max-width: 768px) 50vw, 280px"
                />
                <button
                  type="button"
                  className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                  onClick={() => handleRemove(item)}
                  disabled={removingId === item._id}
                  aria-label="Remove from wishlist">
                  <Heart className="h-4 w-4 fill-current" />
                </button>
                {!inStock ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-semibold text-foreground">
                    Out of stock
                  </div>
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <Link
                    href={`/marketplace/products/${item.product.slug}`}
                    className="font-semibold text-foreground hover:underline line-clamp-2">
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {vendor ? (
                      <Link
                        href={`/marketplace/vendors/${vendor.slug}`}
                        className="hover:underline">
                        {vendor.name}
                      </Link>
                    ) : (
                      'Marketplace'
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(item.product.price)}
                  </span>
                </div>
                {inStock ? (
                  <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90">
                    <Link href={`/marketplace/products/${item.product.slug}`}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to cart
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full rounded-full opacity-60">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Unavailable
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
