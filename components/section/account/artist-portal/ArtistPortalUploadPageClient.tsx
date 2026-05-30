'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { useInitSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { buildWhatsAppHref } from '@/lib/services/whatsappMessaging.service';

export interface ArtistPortalUploadPageClientProps {
  initialLoadError: string | null;
}

const ARTIST_CONTENT_SUBMIT_PAYLOAD = { type: 'artist_content_submit' as const };

export function ArtistPortalUploadPageClient({
  initialLoadError,
}: ArtistPortalUploadPageClientProps) {
  const settings = useInitSiteSettingsStore(s => s.settings);
  const ensureSettingsLoaded = useInitSiteSettingsStore(s => s.actions.ensureSettingsLoaded);

  useEffect(() => {
    void ensureSettingsLoaded(['contactInfo']);
  }, [ensureSettingsLoaded]);

  const waHref = useMemo(
    () => buildWhatsAppHref(settings?.contactInfo?.whatsapp, ARTIST_CONTENT_SUBMIT_PAYLOAD),
    [settings?.contactInfo?.whatsapp]
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <DashboardPageHeader
        title="Submit content"
        description="You can add music and video drafts from My music or My videos. For large files or publishing help, message the team on WhatsApp (or use the contact page if WhatsApp is not configured)."
      />

      {initialLoadError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {initialLoadError}
        </div>
      )}

      <Card className="p-6 md:p-8 space-y-6">
        <p className="text-sm text-muted-foreground">
          Self-service: add drafts from{' '}
          <Link
            href="/account/artist-portal/music"
            className="text-primary underline underline-offset-2">
            My music
          </Link>{' '}
          or{' '}
          <Link
            href="/account/artist-portal/videos"
            className="text-primary underline underline-offset-2">
            My videos
          </Link>
          .
        </p>
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
