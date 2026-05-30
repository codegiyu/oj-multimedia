/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
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
  type WhatsAppMessagePayload,
} from '@/lib/services/whatsappMessaging.service';

export interface CompanyWhatsAppSummaryLine {
  label?: string;
  value: string;
  emphasis?: boolean;
}

export interface CompanyWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  messagePayload: WhatsAppMessagePayload | null;
  summaryLines?: CompanyWhatsAppSummaryLine[];
  summaryExtra?: ReactNode;
  continueLabel?: string;
}

export function CompanyWhatsAppModal({
  open,
  onOpenChange,
  title,
  description,
  messagePayload,
  summaryLines = [],
  summaryExtra,
  continueLabel = 'Continue on WhatsApp',
}: CompanyWhatsAppModalProps) {
  const settings = useInitSiteSettingsStore(s => s.settings);
  const ensureSettingsLoaded = useInitSiteSettingsStore(s => s.actions.ensureSettingsLoaded);

  useEffect(() => {
    if (!open) return;

    void ensureSettingsLoaded(['contactInfo']);
  }, [open]);

  const waHref = useMemo(() => {
    if (!messagePayload) return null;

    return buildWhatsAppHref(settings?.contactInfo?.whatsapp, messagePayload);
  }, [settings?.contactInfo?.whatsapp, messagePayload]);

  const showSummary = summaryLines.length > 0 || summaryExtra != null;

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
            {summaryExtra}
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {waHref ? (
            <RegularBtn
              text={continueLabel}
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
