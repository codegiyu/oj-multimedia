'use client';

import { useEffect, useMemo } from 'react';
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
import { useInitSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import {
  buildWhatsAppHref,
  type PaidDownloadContentType,
} from '@/lib/services/whatsappMessaging.service';
import { formatPrice } from '@/lib/utils/marketplace';

export interface PaidDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: PaidDownloadContentType;
  title: string;
  creatorName: string;
  price: number;
  pageUrl: string;
}

export function PaidDownloadModal({
  open,
  onOpenChange,
  contentType,
  title,
  creatorName,
  price,
  pageUrl,
}: PaidDownloadModalProps) {
  const settings = useInitSiteSettingsStore(s => s.settings);
  const ensureSettingsLoaded = useInitSiteSettingsStore(s => s.actions.ensureSettingsLoaded);

  useEffect(() => {
    if (!open) return;

    void ensureSettingsLoaded(['contactInfo']);
  }, [open, ensureSettingsLoaded]);

  const downloadPayload = useMemo(
    () => ({
      type: 'paid_download' as const,
      data: { contentType, title, creatorName, price, pageUrl },
    }),
    [contentType, title, creatorName, price, pageUrl]
  );

  const waHref = useMemo(
    () => buildWhatsAppHref(settings?.contactInfo?.whatsapp, downloadPayload),
    [settings?.contactInfo?.whatsapp, downloadPayload]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Premium download</DialogTitle>
          <DialogDescription>
            This download is available for {formatPrice(price)}. Contact the team on WhatsApp to
            complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-muted-foreground">{creatorName}</p>
          <p className="text-primary font-semibold">{formatPrice(price)}</p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {waHref ? (
            <RegularBtn
              text="Continue on WhatsApp"
              LeftIcon={MessageCircle}
              className="w-full"
              onClick={() => {
                window.open(waHref, '_blank', 'noopener,noreferrer');
                onOpenChange(false);
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              WhatsApp is not configured yet. Please use the{' '}
              <Link href="/contact" className="text-primary underline underline-offset-2">
                contact page
              </Link>{' '}
              to reach the team.
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
