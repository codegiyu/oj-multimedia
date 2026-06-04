'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AccountSuspendedPayload } from '@/lib/types/rolePortal';

function whatsappHref(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

export interface AccountSuspendedViewProps {
  payload: AccountSuspendedPayload;
}

export function AccountSuspendedView({ payload }: AccountSuspendedViewProps) {
  const wa = whatsappHref(payload.contactWhatsApp);
  const dateLabel = payload.suspensionDate
    ? new Date(payload.suspensionDate).toLocaleString()
    : null;

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <h2 className="text-xl font-semibold text-foreground">Account suspended</h2>
      <p className="text-sm text-muted-foreground">{payload.suspensionReason}</p>
      {dateLabel ? <p className="text-xs text-muted-foreground">Suspended on {dateLabel}</p> : null}
      {wa ? (
        <Button asChild className="gap-2">
          <Link href={wa} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Contact admin
          </Link>
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Please contact support through our contact page for assistance.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        <Link href="/contact" className="text-primary hover:underline">
          Go to contact page
        </Link>
      </p>
    </div>
  );
}
