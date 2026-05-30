'use client';

import { useEffect } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { SocialBtn } from '@/components/layout/Footer';
import { getSocialIcon, formatSocialLabel } from '@/lib/utils/socials';
import { formatOfficeHours } from '@/lib/utils/contactInfo';
import { Skeleton } from '@/components/ui/skeleton';
import type { ContactInfo, Social } from '@/lib/types/site-settings';

export interface ContactInfoSectionProps {
  initialContactInfo?: ContactInfo | null;
  initialSocials?: Social[] | null;
  errorMessage?: string | null;
}

export const ContactInfoSection = ({
  initialContactInfo,
  initialSocials,
  errorMessage,
}: ContactInfoSectionProps = {}) => {
  const { siteLoading } = useSiteStore(state => state);

  const { settings, isLoading, ensureSettingsLoaded } = useSiteSettingsStore(state => ({
    settings: state.settings,
    isLoading: state.loadingSlices.size > 0,
    ensureSettingsLoaded: state.actions.ensureSettingsLoaded,
  }));

  useEffect(() => {
    const slices: Array<'contactInfo' | 'socials'> = [];
    if (initialContactInfo == null) slices.push('contactInfo');
    if (initialSocials == null) slices.push('socials');
    if (slices.length > 0) void ensureSettingsLoaded(slices);
  }, [ensureSettingsLoaded, initialContactInfo, initialSocials]);

  const contactInfo = initialContactInfo ?? settings?.contactInfo;
  const officeHours = formatOfficeHours(contactInfo?.officeHours);

  const socialsSource = initialSocials ?? settings?.socials ?? [];
  const socials = Array.isArray(socialsSource)
    ? socialsSource.map((social: { platform: string; href: string }) => ({
        Icon: getSocialIcon(social.platform as Parameters<typeof getSocialIcon>[0]),
        href: social.href,
        label: formatSocialLabel(social.platform as Parameters<typeof formatSocialLabel>[0]),
      }))
    : [];

  const contactItems = [
    {
      Icon: MapPin,
      title: 'Visit Us',
      details: contactInfo?.address || [],
    },
    {
      Icon: Phone,
      title: 'Call Us',
      details: contactInfo?.tel || [],
      isLink: true,
      linkPrefix: 'tel:',
    },
    {
      Icon: Mail,
      title: 'Email Us',
      details: contactInfo?.email || [],
      isLink: true,
      linkPrefix: 'mailto:',
    },
    {
      Icon: Clock,
      title: 'Office Hours',
      details: officeHours.map(h => `${h.days}: ${h.time}`),
    },
  ];

  const showContactSkeleton = contactInfo == null && initialContactInfo == null && isLoading;
  const showError = !!errorMessage;

  return (
    <SectionContainer className="bg-secondary text-secondary-foreground h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif text-accent">
          Contact Information
        </h2>
        <p className="text-secondary-foreground/80 mb-8">
          Reach out through any of these channels.
        </p>

        {showError && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid gap-6">
          {showContactSkeleton ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            contactItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-foreground/10 flex items-center justify-center flex-shrink-0">
                  <item.Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-1">{item.title}</h3>
                  <div className="grid gap-0.5">
                    {item.details.length === 0 ? (
                      <p className="text-secondary-foreground/50 italic text-sm">Not available</p>
                    ) : (
                      item.details.map((detail, i) => (
                        <p key={i} className="text-secondary-foreground/70">
                          {item.isLink ? (
                            <a
                              href={`${item.linkPrefix}${detail.replace(/\s/g, '')}`}
                              className="hover:text-accent transition-colors">
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 pt-8 border-t border-secondary-foreground/10">
          <h3 className="font-semibold text-secondary-foreground mb-4">Follow Us</h3>
          <div className="flex items-center gap-3">
            {isLoading && socials.length === 0 ? (
              <>
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="size-10 rounded-full" />
              </>
            ) : socials.length === 0 ? (
              <p className="text-secondary-foreground/50 italic text-sm">
                No social links available
              </p>
            ) : (
              socials.map((social, idx) => <SocialBtn key={idx} {...social} />)
            )}
          </div>
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
};
