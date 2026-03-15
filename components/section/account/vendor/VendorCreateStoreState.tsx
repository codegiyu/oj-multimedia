'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
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
    <SectionContainer>
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Store className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{heading}</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">{description}</p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/marketplace/become-vendor">Become a vendor</Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
