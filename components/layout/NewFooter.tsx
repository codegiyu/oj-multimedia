'use client';

import Link from 'next/link';
import { Music, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

const footerLinks = {
  content: {
    title: 'Content',
    links: [
      { name: 'Music', href: '/music' },
      { name: 'Sermons', href: '/sermons' },
      { name: 'Devotionals', href: '/devotionals' },
      { name: 'News', href: '/news' },
      { name: 'Podcasts', href: '/podcasts' },
    ],
  },
  community: {
    title: 'Community',
    links: [
      { name: 'Submit Music', href: '/submit-song' },
      { name: 'Upload Sermon', href: '/upload-sermon' },
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'Become a Vendor', href: '/become-vendor' },
      { name: 'Prayer Requests', href: '/prayer-request' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="regular-container mx-auto py-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">OJ Multimedia</span>
            </Link>
            <p className="text-sm text-background/60 mb-6 max-w-xs">
              Your trusted source for gospel music, inspiring sermons, daily devotionals, and
              Christian resources to strengthen your faith journey.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map(section => (
            <div key={section.title}>
              <h4 className="font-semibold text-background mb-4">{section.title}</h4>
              <ul className="grid gap-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-background transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © 2024 OJ Multimedia. All rights reserved.
            </p>
            <p className="text-sm text-background/50 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-accent" /> for the community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
