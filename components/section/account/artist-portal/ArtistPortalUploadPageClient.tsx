'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { useInitSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';

export interface ArtistPortalUploadPageClientProps {
  initialLoadError: string | null;
}

function buildWhatsAppHref(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/\D/g, '');
  if (!digits.length) return null;
  const text = encodeURIComponent(
    'Hi, I would like to submit music/video for publishing on OJ Multimedia.'
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export function ArtistPortalUploadPageClient({
  initialLoadError,
}: ArtistPortalUploadPageClientProps) {
  const settings = useInitSiteSettingsStore(s => s.settings);
  const fetchSettings = useInitSiteSettingsStore(s => s.actions.fetchSettings);

  useEffect(() => {
    void fetchSettings('contactInfo', { force: false });
  }, [fetchSettings]);

  const waHref = useMemo(
    () => buildWhatsAppHref(settings?.contactInfo?.whatsapp),
    [settings?.contactInfo?.whatsapp]
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <DashboardPageHeader
        title="Submit content"
        description="Only admins can publish on the site. Send tracks, videos, and artwork via WhatsApp (or the contact page if WhatsApp is not set up). The team reviews and publishes when ready."
      />

      {initialLoadError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {initialLoadError}
        </div>
      )}

      <Card className="p-6 md:p-8 space-y-6">
        {waHref ? (
          <>
            <p className="text-sm text-muted-foreground">
              Tap below to open WhatsApp with a pre-filled message to the site team.
            </p>
            <RegularBtn
              text="Message on WhatsApp"
              LeftIcon={MessageCircle}
              className="w-full sm:w-auto"
              onClick={() => {
                window.open(waHref, '_blank', 'noopener,noreferrer');
              }}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            WhatsApp is not configured in site settings yet. Please use the{' '}
            <Link href="/contact" className="text-primary underline underline-offset-2">
              contact page
            </Link>{' '}
            to reach the team.
          </p>
        )}
      </Card>
    </div>
  );
}
