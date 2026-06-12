'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { formatPrice } from '@/lib/utils/marketplace';
import {
  buildVendorProductInquiryHref,
  type ProductInquiryMessageParams,
} from '@/lib/utils/marketplaceProductInquiry';

export interface VendorProductWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: ProductInquiryMessageParams;
  vendorWhatsapp?: string;
  vendorSlug?: string;
}

export function VendorProductWhatsAppModal({
  open,
  onOpenChange,
  inquiry,
  vendorWhatsapp,
  vendorSlug,
}: VendorProductWhatsAppModalProps) {
  const waHref = buildVendorProductInquiryHref(vendorWhatsapp, inquiry);

  const proceed = () => {
    if (!waHref) return;

    window.open(waHref, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat with vendor on WhatsApp</DialogTitle>
          <DialogDescription>
            Review the message below, then continue on WhatsApp and tap Send to reach the vendor.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-2">
          <div>
            <p className="text-muted-foreground text-xs">Product</p>
            <p className="font-medium text-foreground">{inquiry.productName}</p>
          </div>
          {inquiry.vendorName ? (
            <div>
              <p className="text-muted-foreground text-xs">Store</p>
              <p className="font-medium text-foreground">{inquiry.vendorName}</p>
            </div>
          ) : null}
          <div>
            <p className="text-muted-foreground text-xs">Price</p>
            <p className="font-semibold text-primary">{formatPrice(inquiry.price)}</p>
          </div>
          {inquiry.variantLabel ? (
            <div>
              <p className="text-muted-foreground text-xs">Options</p>
              <p className="font-medium text-foreground">{inquiry.variantLabel}</p>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {waHref ? (
            <RegularBtn
              text="Continue on WhatsApp"
              LeftIcon={MessageCircle}
              className="w-full"
              onClick={proceed}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              WhatsApp is not available for this vendor.{' '}
              {vendorSlug ? (
                <>
                  Visit their{' '}
                  <Link
                    href={`/marketplace/vendors/${vendorSlug}`}
                    className="text-primary underline underline-offset-2">
                    store page
                  </Link>{' '}
                  instead.
                </>
              ) : (
                'Please try again later.'
              )}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
