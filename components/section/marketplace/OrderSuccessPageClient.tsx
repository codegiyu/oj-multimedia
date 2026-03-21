'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function OrderSuccessPageClient() {
  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Thank you for your order!</h1>
          <p className="text-muted-foreground mb-8">
            Your order has been placed successfully. Vendors will contact you to arrange payment and
            delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/marketplace">Continue shopping</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/marketplace/products">Browse products</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
