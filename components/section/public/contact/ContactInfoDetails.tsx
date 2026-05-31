'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { formatOfficeHours } from '@/lib/utils/contactInfo';
import { Skeleton } from '@/components/ui/skeleton';
import type { ContactInfo } from '@/lib/types/site-settings';

export interface ContactInfoDetailsProps {
  initialContactInfo?: ContactInfo | null;
  errorMessage?: string | null;
}

export function ContactInfoDetails({
  initialContactInfo,
  errorMessage,
}: ContactInfoDetailsProps = {}) {
  const { siteLoading } = useSiteStore(state => state);

  const { settings, isLoading, ensureSettingsLoaded } = useSiteSettingsStore(state => ({
    settings: state.settings,
    isLoading: state.loadingSlices.size > 0,
    ensureSettingsLoaded: state.actions.ensureSettingsLoaded,
  }));

  useEffect(() => {
    if (initialContactInfo == null) void ensureSettingsLoaded(['contactInfo']);
  }, [ensureSettingsLoaded, initialContactInfo]);

  const contactInfo = initialContactInfo ?? settings?.contactInfo;
  const officeHours = formatOfficeHours(contactInfo?.officeHours);

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
    <>
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
    </>
  );
}
