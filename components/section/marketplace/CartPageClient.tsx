'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/marketplace';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CartPageClient() {
  const { items, actions } = useCartStore();
  const total = actions.getTotal();

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
              Add items from the marketplace to get started.
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
                  <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
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
            <p className="text-xl font-bold text-foreground">Total: {formatPrice(total)}</p>
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
