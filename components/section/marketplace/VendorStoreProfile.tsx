'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { FillImage } from '@/components/general/FillImage';
import { MultilineText } from '@/components/general/MultilineText';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';
import { MarketplaceVendorChatButton } from '@/components/section/marketplace/MarketplaceVendorChatButton';
import { MarketplaceVendorWhatsAppModal } from '@/components/section/marketplace/MarketplaceVendorWhatsAppModal';
import { buildVendorStoreInquiryHref } from '@/lib/utils/marketplaceVendorStoreInquiry';

type VendorStoreProfileProps = {
  vendor: IMarketplaceVendor | null;
};

export function VendorStoreProfile({ vendor }: VendorStoreProfileProps) {
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  if (!vendor) {
    return (
      <SectionContainer className="marketplace-page-top">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            This store does not currently exist
          </h1>
          <p className="text-muted-foreground mb-6">
            The vendor store you are looking for is unavailable or has been removed.
          </p>
          <Link href="/marketplace/vendors" className="text-primary hover:underline">
            Back to vendors
          </Link>
        </div>
      </SectionContainer>
    );
  }

  const storeUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/marketplace/vendors/${vendor.slug}`
      : `/marketplace/vendors/${vendor.slug}`;

  const waHref = buildVendorStoreInquiryHref(vendor.whatsapp, {
    vendorName: vendor.storeName,
    storeUrl,
  });

  return (
    <SectionContainer className="marketplace-page-top">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-primary">
            Marketplace
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/marketplace/vendors" className="hover:text-primary">
            Vendors
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{vendor.storeName}</span>
        </nav>

        <Card className="p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-24 h-24 rounded-full bg-primary/10 overflow-hidden shrink-0">
              <FillImage
                src={vendor.logo ?? ''}
                alt={vendor.storeName}
                imageContext="public"
                sizes="96px"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {vendor.storeName}
              </h1>
              {vendor.storeDescription && (
                <MultilineText
                  text={vendor.storeDescription}
                  className="mb-4"
                  paragraphClassName="text-muted-foreground"
                />
              )}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {vendor.isVerified && (
                  <span className="inline-block text-sm font-medium text-primary">
                    Verified vendor
                  </span>
                )}
                <MarketplaceVendorChatButton
                  vendorWhatsapp={vendor.whatsapp}
                  label="Chat on WhatsApp"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onChatClick={() => setWhatsappOpen(true)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <MarketplaceVendorWhatsAppModal
        open={whatsappOpen}
        onOpenChange={setWhatsappOpen}
        title="Chat with vendor on WhatsApp"
        summaryLines={[{ label: 'Store', value: vendor.storeName }]}
        waHref={waHref}
      />
    </SectionContainer>
  );
}
