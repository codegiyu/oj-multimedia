'use client';

import Link from 'next/link';
import { GhostBtn } from '../atoms/GhostBtn';
import { Logo } from '../atoms/Logo';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { getSocialIcon, formatSocialLabel } from '@/lib/utils/socials';
import type { SocialPlatform } from '@/lib/types/site-settings';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContentSubmitWhatsApp } from '@/components/section/shared/ContentSubmitWhatsAppTrigger';

const footerLinks = {
  platform: [
    { label: 'Music', href: '/music' },
    { label: 'Videos', href: '/videos' },
    { label: 'News', href: '/news' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Community', href: '/community' },
  ],
  creators: [
    { label: 'Upload Music', href: '/community/promote-your-content' },
    { label: 'Upload Video', href: '/community/promote-your-content' },
    // { label: 'Start Podcast', href: '/community/promote-your-content' },
    { label: 'Become a Vendor', href: '/marketplace/become-vendor' },
    { label: 'Artist Portal', href: '/community/artists' },
  ],
  resources: [
    { label: 'Daily Devotionals', href: '/community/devotionals' },
    { label: 'Bible Study', href: '/community/devotionals/bible-study' },
    { label: 'Help Center', href: '/contact' },
    { label: 'Guidelines', href: '/terms-and-conditions' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    // { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-and-conditions' },
  ],
};

export const Footer = () => {
  const musicSubmit = useContentSubmitWhatsApp('music');
  const videoSubmit = useContentSubmitWhatsApp('video');
  const currentYear = new Date().getFullYear();

  const { socials, appDetails } = useSiteSettingsStore(state => ({
    socials: state.settings?.socials,
    appDetails: state.settings?.appDetails,
  }));

  const appSocials =
    socials?.map((social: { platform: SocialPlatform; href: string }) => ({
      Icon: getSocialIcon(social.platform),
      href: social.href,
      label: formatSocialLabel(social.platform),
    })) || [];

  const appDescription =
    appDetails?.description ||
    'Your platform for fresh music, creative videos, and inspiring stories.';

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold mb-2">Stay in the Loop</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest updates on new releases, trending content, and community news.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled
                title="Newsletter subscription requires backend integration"
              />
              <Button
                variant="hero"
                size="lg"
                className="gap-2"
                disabled
                title="Newsletter subscription requires backend integration">
                <Mail className="w-4 h-4" />
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Newsletter subscription coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo showText={true} hideTextOnMobile={false} className="mb-4" />
            <p className="text-sm text-muted-foreground mb-4">{appDescription}</p>
            <div className="flex gap-2">
              {appSocials.map(
                (social: { Icon: React.ElementType; href: string; label: string }, idx: number) => (
                  <SocialBtn
                    key={`${social.label}-${idx}`}
                    Icon={social.Icon}
                    href={social.href}
                    label={social.label}
                  />
                )
              )}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2">
              {footerLinks.creators.map(link => {
                if (link.label === 'Upload Music') {
                  return (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={musicSubmit.openSubmitModal}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                        {link.label}
                      </button>
                    </li>
                  );
                }
                if (link.label === 'Upload Video') {
                  return (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={videoSubmit.openSubmitModal}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                        {link.label}
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
              <p>© {currentYear} OJ Multimedia. All rights reserved.</p>
              <span className="hidden md:inline text-muted-foreground/50">|</span>
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden md:inline text-muted-foreground/50">|</span>
              <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span className="hidden md:inline text-muted-foreground/50">|</span>
              <Link href="/admin/dashboard/home" className="hover:text-primary transition-colors">
                Admin
              </Link>
            </div>
            <p>
              Built by{' '}
              <a
                href="https://portfolio-codegiyu.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-lobster text-red-600 hover:text-red-700 transition-colors">
                <span className="text-xl font-black">C</span>
                <span>odegiyu</span>
              </a>
            </p>
          </div>
        </div>
      </div>
      {musicSubmit.modal}
      {videoSubmit.modal}
    </footer>
  );
};

export interface SocialBtnProps {
  Icon: React.ElementType;
  href: string;
  label: string;
}

export function SocialBtn({ Icon, href, label }: SocialBtnProps) {
  return (
    <GhostBtn
      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      linkProps={{ href, target: '_blank', rel: 'noopener noreferrer' }}
      aria-label={label}>
      <Icon className="size-5" />
    </GhostBtn>
  );
}
