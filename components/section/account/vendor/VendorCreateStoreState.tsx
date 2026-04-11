'use client';

import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';
import Link from 'next/link';

interface VendorCreateStoreStateProps {
  heading?: string;
  description?: string;
}

export function VendorCreateStoreState({
  heading = 'Create your store',
  description = 'You do not have a vendor store yet. Become a vendor to start listing products and receive orders.',
}: VendorCreateStoreStateProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-2xl border border-border/80 bg-card px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Store className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">{heading}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
        <Link href="/marketplace/become-vendor">Become a vendor</Link>
      </Button>
    </div>
  );
}
