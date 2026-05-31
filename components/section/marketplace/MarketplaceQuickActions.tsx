'use client';

import Link from 'next/link';
import { ShoppingBag, UserPlus, Package, ShoppingCart } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MarketplaceQuickActions() {
  return (
    <SectionContainer className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={ShoppingBag}
          heading="Quick Actions"
          subtext="Manage your marketplace experience"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Cart & Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">View cart and order history</p>
            <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
              <Link href="/marketplace/cart">View Cart</Link>
            </Button>
            <span className="mx-2 text-muted-foreground">·</span>
            <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
              <Link href="/marketplace/orders">My Orders</Link>
            </Button>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Become a Vendor</h3>
            <p className="text-sm text-muted-foreground mb-4">Start selling on our marketplace</p>
            <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
              <Link href="/marketplace/become-vendor">Register Now</Link>
            </Button>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">My Account</h3>
            <p className="text-sm text-muted-foreground mb-4">Login or manage your account</p>
            <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
              <Link href="/account">Manage Account</Link>
            </Button>
          </Card>
        </div>
      </div>
    </SectionContainer>
  );
}
