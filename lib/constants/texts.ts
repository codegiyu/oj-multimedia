import { HeaderLinkProps } from '@/components/layout/Header';

const liveUrl = process.env.live_url || 'https://example.com';

export const SEO_DETAILS = {
  title: {
    default: 'OJ Multimedia - Christian Multimedia Blog',
    template: '%s | OJ Multimedia',
  },
  description:
    'Your trusted source for gospel music, inspiring sermons, daily devotionals, Christian news, and resources to strengthen your faith journey. Discover the latest gospel content and connect with a vibrant Christian community.',
  ogDesc:
    'Strengthen your faith through gospel music, sermons, devotionals, and Christian resources. Join OJ Multimedia for daily inspiration and spiritual growth.',
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
  authors: [{ name: 'OJ Multimedia', url: liveUrl }],
  keywords: [
    'OJ Multimedia',
    'Gospel Music',
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
  ],
  generator: 'Next.js',
  publisher: 'OJ Multimedia',
  category: 'Christian Media & Resources',
  classification:
    'Christian multimedia platform for gospel music, sermons, devotionals, and faith resources',
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
