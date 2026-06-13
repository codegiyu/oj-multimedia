'use client';

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
import { hasVendorWhatsapp } from '@/lib/utils/marketplaceVendorContact';
import type { CartItem } from '@/lib/store/cartStore';

export type CheckoutVendorSummary = {
  vendorName: string;
  vendorWhatsapp?: string;
  itemCount: number;
  subtotal: number;
};

export interface CheckoutPlaceOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  total: number;
  vendors: CheckoutVendorSummary[];
  loading?: boolean;
  onConfirm: () => void;
}

export function CheckoutPlaceOrderModal({
  open,
  onOpenChange,
  items,
  total,
  vendors,
  loading = false,
  onConfirm,
}: CheckoutPlaceOrderModalProps) {
  const vendorsWithWhatsapp = vendors.filter(v => hasVendorWhatsapp(v.vendorWhatsapp));
  const vendorsWithoutWhatsapp = vendors.filter(v => !hasVendorWhatsapp(v.vendorWhatsapp));

  const continueLabel =
    vendorsWithWhatsapp.length > 0
      ? vendorsWithWhatsapp.length === 1
        ? 'Place order and continue on WhatsApp'
        : 'Place order and open WhatsApp chats'
      : 'Place order';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm your order</DialogTitle>
          <DialogDescription>
            {vendorsWithWhatsapp.length > 0
              ? 'Your order will be created, then WhatsApp will open so you can tap Send and notify your vendor(s).'
              : 'Your order will be created. Vendors without WhatsApp on file will contact you another way.'}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-3 max-h-60 overflow-y-auto">
          <div>
            <p className="text-muted-foreground text-xs">Items</p>
            <ul className="space-y-1 mt-1">
              {items.map(item => (
                <li
                  key={item.sku ? `${item.productId}-${item.sku}` : item.productId}
                  className="flex justify-between gap-2 text-foreground">
                  <span className="line-clamp-1">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between border-t pt-2 font-semibold text-primary">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {vendorsWithWhatsapp.length > 0 && (
          <div className="text-sm space-y-1">
            <p className="font-medium text-foreground">WhatsApp will open for:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              {vendorsWithWhatsapp.map(vendor => (
                <li key={vendor.vendorName}>{vendor.vendorName}</li>
              ))}
            </ul>
          </div>
        )}

        {vendorsWithoutWhatsapp.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {vendorsWithoutWhatsapp.map(v => v.vendorName).join(', ')} do not have WhatsApp on file.
            Their order(s) will still be placed.
          </p>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <RegularBtn
            text={loading ? 'Placing order…' : continueLabel}
            LeftIcon={MessageCircle}
            className="w-full"
            loading={loading}
            disabled={loading}
            onClick={onConfirm}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
