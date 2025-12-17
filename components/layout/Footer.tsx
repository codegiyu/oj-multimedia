/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { GhostBtn } from '../atoms/GhostBtn';
import { NAV_LINKS } from '@/lib/constants/texts';
import { HeaderLinkProps } from './Header';
import { IconComp } from '@/lib/types/general';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { getSocialIcon, formatSocialLabel } from '@/lib/utils/socials';
import { Skeleton } from '@/components/ui/skeleton';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { settings, isLoading, fetchSettings } = useSiteSettingsStore(state => ({
    settings: state.settings,
    isLoading: state.isLoading,
    fetchSettings: state.actions.fetchSettings,
  }));

  useEffect(() => {
    // Fetch socials and app details
    fetchSettings('socials');
    fetchSettings('appDetails');
  }, []);

  const socials =
    settings?.socials?.map(social => ({
      Icon: getSocialIcon(social.platform),
      href: social.href,
      label: formatSocialLabel(social.platform),
    })) || [];

  const appName = settings?.appDetails?.appName || 'OJ Multimedia';
  const appDescription =
    settings?.appDetails?.description ||
    'Your trusted source for gospel music, inspiring sermons, daily devotionals, and Christian resources to strengthen your faith journey.';

  // Split navigation links into two groups
  const contentLinks = NAV_LINKS.filter(
    item => !item.showInHeaderOnly && ['Music', 'Sermons', 'Devotionals'].includes(item.text)
  );
  const pageLinks = NAV_LINKS.filter(
    item => !item.showInHeaderOnly && !['Music', 'Sermons', 'Devotionals'].includes(item.text)
  );

  return (
    <footer className="bg-[#1E3A8A] text-white pt-16 md:pt-16 lg:pt-20 2xl:pt-28">
      <div className="regular-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[0.9375rem] mb-12">
          {/* Company Info */}
          <div className="h-fit grid gap-4">
            <div className="flex items-center">
              <GhostBtn linkProps={{ href: '/' }} className="group">
                <span className="text-3xl font-bold font-sans text-white group-hover:opacity-80 transition-opacity">
                  OJ Multimedia
                </span>
              </GhostBtn>
            </div>
            <p className="text-white/80 text-[0.9375rem] leading-[1.6]">
              {appDescription ||
                'Your trusted source for gospel music, inspiring sermons, daily devotionals, and Christian resources to strengthen your faith journey.'}
            </p>
            <div className="w-full flex items-center gap-4">
              {isLoading && socials.length === 0 ? (
                <>
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                </>
              ) : (
                socials.map((social, idx) => <SocialBtn key={idx} {...social} />)
              )}
            </div>
          </div>

          {/* Content Links */}
          <div className="h-fit grid gap-4">
            <h3 className="text-lg font-bold text-white">Content</h3>
            <ul className="grid gap-3">
              {contentLinks.map((item, idx) => (
                <FooterLink key={idx} {...item} />
              ))}
            </ul>
          </div>

          {/* Page Links */}
          <div className="h-fit grid gap-4">
            <h3 className="text-lg font-bold text-white">Pages</h3>
            <ul className="grid gap-3">
              {pageLinks.map((item, idx) => (
                <FooterLink key={idx} {...item} />
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60">
          <p className="text-[0.9375rem]">
            &copy; {currentYear} {appName || 'OJ Multimedia'}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <FooterLink text="Privacy Policy" href="/privacy" />
            <span className="text-white/40"></span>
            <FooterLink text="Terms & Conditions" href="/terms" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ text, href = '#', footerOnlySuffix = '', afterClick }: HeaderLinkProps) => {
  return (
    <li className={``}>
      <GhostBtn
        className={`w-fit py-0`}
        wrapClassName={`w-fit`}
        {...(href && { linkProps: { href } })}
        onClick={() => {
          afterClick?.();
        }}>
        <div className="w-fit px-0 relative">
          <p className={`text-white/70 hover:text-white transition-smooth font-medium`}>
            {text + footerOnlySuffix}
          </p>
        </div>
      </GhostBtn>
    </li>
  );
};

export interface SocialBtnProps {
  Icon: IconComp;
  href: string;
  label: string;
}

export function SocialBtn({ Icon, href, label }: SocialBtnProps) {
  return (
    <GhostBtn
      className="size-10 bg-white/10 grid place-items-center rounded-full hover:bg-white/20 hover:scale-110 transition-all transition-smooth backdrop-blur-sm"
      linkProps={{ href, target: '_blank', rel: 'noopener noreferrer' }}
      aria-label={label}>
      <i className="text-xl text-white">
        <Icon />
      </i>
    </GhostBtn>
  );
}
