'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { IUserWishlistItem } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import { FillImage } from '@/components/general/FillImage';

interface AccountHubWishlistPreviewProps {
  wishlistPreview: IUserWishlistItem[];
}

export function AccountHubWishlistPreview({ wishlistPreview }: AccountHubWishlistPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">Your wishlist</h2>
        <Link href="/account/wishlist" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {wishlistPreview.length === 0 ? (
          <Card className="col-span-full border-border/80 py-10 text-center text-sm text-muted-foreground shadow-sm">
            Your wishlist is empty.{' '}
            <Link href="/marketplace" className="font-medium text-primary hover:underline">
              Explore products
            </Link>
          </Card>
        ) : (
          wishlistPreview.map(item => {
            const img = item.product.images?.[0];
            return (
              <Card
                key={item._id}
                className="gap-0 overflow-hidden border-border/80 py-0 shadow-sm">
                <div className="relative aspect-[4/5] bg-muted">
                  <FillImage
                    src={img ?? ''}
                    alt=""
                    imageContext="dashboard"
                    sizes="(max-width: 768px) 50vw, 280px"
                  />
                </div>
                <div className="space-y-1 p-3">
                  <p className="line-clamp-2 text-sm font-medium text-foreground">
                    {item.product.name}
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
