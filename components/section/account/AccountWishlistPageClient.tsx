'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/marketplace';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { IUserWishlistItem } from '@/lib/constants/endpoints';
import { toast } from 'sonner';

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
      <SectionContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Wishlist</h1>
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialLoadError}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
          <Button asChild variant="outline">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      </SectionContainer>
    );
  }

  if (items.length === 0) {
    return (
      <SectionContainer>
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            You do not have any items in your wishlist yet. Start exploring the marketplace to add
            products you love.
          </p>
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Wishlist</h1>
            <p className="text-sm text-muted-foreground">Your saved items from the marketplace.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/marketplace">Continue shopping</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {items.map(item => {
            const imageUrl = item.product.images?.[0];
            const vendor = item.product.vendor;
            return (
              <Card key={item._id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/marketplace/products/${item.product.slug}`}
                    className="font-semibold text-foreground hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {vendor ? (
                      <>
                        by{' '}
                        <Link
                          href={`/marketplace/vendors/${vendor.slug}`}
                          className="hover:underline">
                          {vendor.name}
                        </Link>
                      </>
                    ) : (
                      'Marketplace vendor'
                    )}
                  </p>
                  <p className="text-primary font-bold mt-1">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <Button asChild size="sm" className="w-full sm:w-auto bg-primary">
                    <Link href={`/marketplace/products/${item.product.slug}`}>View product</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto text-muted-foreground"
                    disabled={removingId === item._id}
                    onClick={() => handleRemove(item)}>
                    {removingId === item._id ? 'Removing…' : 'Remove'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
