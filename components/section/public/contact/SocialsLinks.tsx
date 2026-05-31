'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { SocialBtn } from '@/components/layout/Footer';
import { getSocialIcon, formatSocialLabel } from '@/lib/utils/socials';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import type { Social } from '@/lib/types/site-settings';

export interface SocialsLinksProps {
  initialSocials?: Social[] | null;
  errorMessage?: string | null;
}

export function SocialsLinks({ initialSocials, errorMessage }: SocialsLinksProps = {}) {
  const { siteLoading } = useSiteStore(state => state);

  const { settings, isLoading, ensureSettingsLoaded } = useSiteSettingsStore(state => ({
    settings: state.settings,
    isLoading: state.loadingSlices.size > 0,
    ensureSettingsLoaded: state.actions.ensureSettingsLoaded,
  }));

  useEffect(() => {
    if (initialSocials == null) void ensureSettingsLoaded(['socials']);
  }, [ensureSettingsLoaded, initialSocials]);

  const socialsSource = initialSocials ?? settings?.socials ?? [];
  const socials = Array.isArray(socialsSource)
    ? socialsSource.map((social: { platform: string; href: string }) => ({
        Icon: getSocialIcon(social.platform as Parameters<typeof getSocialIcon>[0]),
        href: social.href,
        label: formatSocialLabel(social.platform as Parameters<typeof formatSocialLabel>[0]),
      }))
    : [];

  const showError = !!errorMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      viewport={{ once: true }}
      className="mt-10 pt-8 border-t border-secondary-foreground/10">
      <h3 className="font-semibold text-secondary-foreground mb-4">Follow Us</h3>

      {showError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {isLoading && socials.length === 0 ? (
          <>
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
          </>
        ) : socials.length === 0 ? (
          <p className="text-secondary-foreground/50 italic text-sm">No social links available</p>
        ) : (
          socials.map((social, idx) => <SocialBtn key={idx} {...social} />)
        )}
      </div>
    </motion.div>
  );
}
