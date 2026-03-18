/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/marketplace';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { callApi } from '@/lib/services/callApi';
import type { ICartRes } from '@/lib/constants/endpoints';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CartPageClient() {
  const { items, actions } = useCartStore();
  const total = actions.getTotal();
  const { user } = useAuthStore(state => state);
  const [loading, setLoading] = useState(false);

  const vendors = items
    .filter(item => item.vendorWhatsapp)
    .reduce<
      Array<{
        vendorName: string;
        vendorWhatsapp: string;
        images: string[];
      }>
    >((acc, item) => {
      const key = item.vendorWhatsapp as string;
      const existing = acc.find(v => v.vendorWhatsapp === key);
      const image = item.image;
      if (existing) {
        if (image && !existing.images.includes(image)) {
          existing.images.push(image);
        }
        return acc;
      }
      return [
        ...acc,
        {
          vendorName: item.vendorName || 'Vendor',
          vendorWhatsapp: key,
          images: image ? [image] : [],
        },
      ];
    }, []);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      const { data } = await callApi('USER_CART_GET', {});
      if (!mounted) return;
      const cart = data as ICartRes | undefined;
      if (cart?.items) {
        actions.syncFromBackend(cart);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user, actions]);

  if (items.length === 0) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              {loading ? 'Loading your cart...' : 'Add items from the marketplace to get started.'}
            </p>
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Cart</h1>

          <div className="space-y-4 mb-10">
            {items.map(item => (
              <Card key={item.productId} className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/marketplace/products/${item.slug}`}
                    className="font-semibold text-foreground hover:text-primary line-clamp-2">
                    {item.name}
                  </Link>
                  {item.vendorName && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      from{' '}
                      {item.vendorSlug ? (
                        <Link
                          href={`/marketplace/vendors/${item.vendorSlug}`}
                          className="hover:text-primary underline-offset-2 hover:underline">
                          {item.vendorName}
                        </Link>
                      ) : (
                        item.vendorName
                      )}
                    </p>
                  )}
                  <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                  {item.vendorWhatsapp && (
                    <a
                      href={`https://wa.me/${item.vendorWhatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      Contact vendor on WhatsApp
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => actions.updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => actions.updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => actions.removeItem(item.productId)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-foreground">Total: {formatPrice(total)}</p>
              {vendors.length > 0 && (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Chat with vendor
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="top">
                      {vendors.map(vendor => (
                        <DropdownMenuItem
                          key={vendor.vendorWhatsapp}
                          className="flex items-center gap-2"
                          onClick={() => {
                            const digits = vendor.vendorWhatsapp.replace(/\D/g, '');
                            const url = `https://wa.me/${digits}`;
                            window.open(url, '_blank');
                          }}>
                          <div className="flex -space-x-2">
                            {vendor.images.slice(0, 3).map(src => (
                              <span
                                key={src}
                                className="inline-block h-6 w-6 rounded-full overflow-hidden border border-border bg-muted">
                                <img
                                  src={src}
                                  alt={vendor.vendorName}
                                  className="h-full w-full object-cover"
                                />
                              </span>
                            ))}
                          </div>
                          <span className="truncate">{vendor.vendorName}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/marketplace/products">Continue shopping</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/marketplace/checkout">Proceed to checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
