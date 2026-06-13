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
import { openWhatsAppLink } from '@/lib/utils/marketplaceWhatsapp';

export interface MarketplaceVendorWhatsAppSummaryLine {
  label?: string;
  value: string;
  emphasis?: boolean;
}

export interface MarketplaceVendorWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  summaryLines?: MarketplaceVendorWhatsAppSummaryLine[];
  messagePreview?: string;
  waHref: string | null;
  continueLabel?: string;
  onContinue?: () => void;
}

export function MarketplaceVendorWhatsAppModal({
  open,
  onOpenChange,
  title = 'Chat with vendor on WhatsApp',
  description = 'Review the message below, then continue on WhatsApp and tap Send to reach the vendor.',
  summaryLines = [],
  messagePreview,
  waHref,
  continueLabel = 'Continue on WhatsApp',
  onContinue,
}: MarketplaceVendorWhatsAppModalProps) {
  const proceed = () => {
    if (onContinue) {
      onContinue();
      return;
    }

    if (!waHref) return;

    openWhatsAppLink(waHref);
    onOpenChange(false);
  };

  const showSummary = summaryLines.length > 0;
  const showPreview = Boolean(messagePreview?.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {showSummary && (
          <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-2">
            {summaryLines.map((line, index) => (
              <div key={`${line.label ?? 'line'}-${index}`}>
                {line.label ? <p className="text-muted-foreground text-xs">{line.label}</p> : null}
                <p
                  className={
                    line.emphasis ? 'font-semibold text-primary' : 'font-medium text-foreground'
                  }>
                  {line.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {showPreview && (
          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground text-xs mb-2">Message preview</p>
            <pre className="whitespace-pre-wrap font-sans text-foreground text-sm leading-relaxed">
              {messagePreview}
            </pre>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {waHref || onContinue ? (
            <RegularBtn
              text={continueLabel}
              LeftIcon={MessageCircle}
              className="w-full"
              onClick={proceed}
            />
          ) : null}
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
