'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  type MarketplaceWhatsappLinkEntry,
  readMarketplaceWhatsappLinks,
} from '@/lib/utils/marketplaceWhatsapp';
import { MarketplaceOrderWhatsAppButton } from '@/components/section/marketplace/MarketplaceOrderWhatsAppButton';

export function OrderSuccessPageClient() {
  const searchParams = useSearchParams();
  const [whatsappLinks, setWhatsappLinks] = useState<MarketplaceWhatsappLinkEntry[]>([]);

  const orderNumbers = useMemo(() => {
    const raw = searchParams.get('orderNumbers');
    if (!raw) return [];
    return raw
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
  }, [searchParams]);

  const orderIds = useMemo(() => {
    const raw = searchParams.get('orderIds');
    if (!raw) return [];
    return raw
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
  }, [searchParams]);

  const expectsWhatsapp = searchParams.get('whatsapp') === '1';

  useEffect(() => {
    setWhatsappLinks(readMarketplaceWhatsappLinks());
  }, []);

  return (
    <MainLayout>
      <SectionContainer className="marketplace-page-top">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Thank you for your order!</h1>
          <p className="text-muted-foreground mb-4">
            {whatsappLinks.length > 0
              ? 'Your order has been placed. Message each vendor on WhatsApp and tap Send to share your order details.'
              : 'Your order has been placed successfully. Vendors will contact you to arrange payment and delivery.'}
          </p>
          {orderNumbers.length > 0 && (
            <div className="mb-8 rounded-lg border border-border/80 bg-muted/30 px-4 py-3 text-left">
              <p className="text-sm font-medium text-foreground mb-2">
                {orderNumbers.length === 1 ? 'Order number' : 'Order numbers'}
              </p>
              <ul className="space-y-1">
                {orderNumbers.map((orderNumber, index) => (
                  <li
                    key={orderIds[index] ?? orderNumber}
                    className="font-mono text-sm text-primary">
                    {orderNumber}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {whatsappLinks.length > 0 && (
            <div className="mb-8 flex flex-col items-center gap-3">
              {whatsappLinks.map((entry, index) => (
                <MarketplaceOrderWhatsAppButton
                  key={`${entry.orderNumber}-${entry.link}`}
                  orderId={orderIds[index] ?? entry.orderNumber}
                  orderNumber={entry.orderNumber}
                  vendorName={entry.vendorName}
                  whatsappLink={entry.link}
                  label={`Message ${entry.vendorName} on WhatsApp`}
                  variant="default"
                  size="lg"
                  className="group w-full sm:w-fit rounded-full bg-primary hover:bg-primary/90"
                />
              ))}
              <p className="text-sm text-muted-foreground">
                Tap Send in WhatsApp to deliver your order details to the vendor.
              </p>
            </div>
          )}
          {expectsWhatsapp && whatsappLinks.length === 0 && (
            <p className="mb-8 text-sm text-muted-foreground">
              If WhatsApp did not open, check your orders email or contact the vendor directly.
            </p>
          )}
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
