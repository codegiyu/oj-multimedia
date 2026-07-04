'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { useInitSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { buildWhatsAppHref } from '@/lib/services/whatsappMessaging.service';

const ARTIST_CONTENT_SUBMIT_PAYLOAD = { type: 'artist_content_submit' as const };

export function ArtistMediaUploadGateNotice() {
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
    <div className="rounded-md border border-border/60 bg-muted/30 px-4 py-3 space-y-2">
      <p className="text-sm font-medium">Audio and video files</p>
      <p className="text-sm text-muted-foreground">
        Direct file upload is not available in the artist portal. Paste a hosted URL below, or
        message the admin team on WhatsApp to submit audio or video files for publishing.
      </p>
      {waHref ? (
        <RegularBtn
          type="button"
          text="Message on WhatsApp"
          LeftIcon={MessageCircle}
          variant="outline"
          size="sm"
          onClick={() => {
            window.open(waHref, '_blank', 'noopener,noreferrer');
          }}
        />
      ) : (
        <p className="text-xs text-muted-foreground">
          WhatsApp is not configured yet. Use the{' '}
          <Link href="/contact" className="underline underline-offset-2">
            contact page
          </Link>{' '}
          instead.
        </p>
      )}
    </div>
  );
}
