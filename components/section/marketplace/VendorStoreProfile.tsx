'use client';

import Link from 'next/link';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FillImage } from '@/components/general/FillImage';
import { MultilineText } from '@/components/general/MultilineText';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

type VendorStoreProfileProps = {
  vendor: IMarketplaceVendor | null;
};

export function VendorStoreProfile({ vendor }: VendorStoreProfileProps) {
  if (!vendor) {
    return (
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Vendor not found</h1>
          <Link href="/marketplace/vendors" className="text-primary hover:underline">
            Back to vendors
          </Link>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer className="py-16 md:py-20">
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
                {vendor.whatsapp && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a
                      href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SectionContainer>
  );
}
