import { HeaderLinkProps } from '@/components/layout/Header';

const liveUrl = process.env.live_url || 'https://example.com';

export const SEO_DETAILS = {
  title: {
    default: 'OHEJUIRA - Christian Multimedia Platform',
    template: '%s | OHEJUIRA',
  },
  description:
    'OHEJUIRA is a Christian-based multimedia platform offering gospel music downloads, inspirational music, sermons, devotionals, gospel news, resources, promotional services, and a vendor marketplace. Serving humanity through innovation in entertainment and technology.',
  ogDesc:
    'Transform lives through creative expression and technology-driven storytelling. Access gospel music, sermons, devotionals, and Christian resources on OHEJUIRA.',
  metadataBase: new URL(liveUrl),
  alternates: {
    canonical: liveUrl,
  },
  image: `${liveUrl}/og-image.png`,
  icons: `/favicon.ico`,
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
    },
  },
  authors: [{ name: 'OHEJUIRA-Multimedia', url: liveUrl }],
  keywords: [
    'OHEJUIRA',
    'OHEJUIRA-Multimedia',
    'Gospel Music',
    'Inspirational Music',
    'Christian Sermons',
    'Daily Devotionals',
    'Gospel News',
    'Christian Resources',
    'Prayer Requests',
    'Bible Study',
    'Christian Community',
    'Gospel Artists',
    'Pastors',
    'Christian Blog',
    'Faith Resources',
    'Spiritual Growth',
    'Christian Content',
    'Multimedia Platform',
    'Content Creation',
    'Production Services',
  ],
  generator: 'Next.js',
  publisher: 'OHEJUIRA-Multimedia',
  category: 'Christian Media & Resources',
  classification:
    'Christian multimedia platform for gospel music, sermons, devotionals, and faith resources. Serving humanity through innovation in entertainment and technology.',
};

export const NAV_LINKS: HeaderLinkProps[] = [
  { text: 'Home', href: '/' },
  { text: 'Music', href: '/music' },
  { text: 'Sermons', href: '/sermons' },
  { text: 'Devotionals', href: '/devotionals' },
  { text: 'News', href: '/news' },
  { text: 'Resources', href: '/resources' },
  { text: 'Community', href: '/community' },
  { text: 'Marketplace', href: '/marketplace' },
  { text: 'Contact', href: '/contact' },
];
