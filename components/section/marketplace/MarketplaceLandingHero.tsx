'use client';

import Link from 'next/link';
import { ShoppingBag, Store, UserPlus, Package, ShoppingCart, Search } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';

export function MarketplaceLandingHero() {
  const { actions } = useCartStore();
  const cartCount = actions.getCount();

  return (
    <SectionContainer className="marketplace-page-top-hero bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Marketplace</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Shop from Christian vendors — fashion, food, health & beauty, accessories, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="default" className="gap-2 bg-primary hover:bg-primary/90">
            <Link href="/marketplace/products">
              <Package className="w-4 h-4" />
              Browse Products
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/marketplace/vendors">
              <Store className="w-4 h-4" />
              View Vendors
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/marketplace/search">
              <Search className="w-4 h-4" />
              Search
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/marketplace/cart">
              <ShoppingCart className="w-4 h-4" />
              Cart {cartCount > 0 ? `(${cartCount})` : ''}
            </Link>
          </Button>
          <Button asChild variant="accent" className="gap-2">
            <Link href="/marketplace/become-vendor">
              <UserPlus className="w-4 h-4" />
              Become a Vendor
            </Link>
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
