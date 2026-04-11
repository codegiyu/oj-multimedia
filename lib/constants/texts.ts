const liveUrl = process.env.NEXT_PUBLIC_LIVE_URL || 'https://www.ojmultimedia.com';

/** Public marketing site URL for “leave admin” links; same-origin `/` when unset (e.g. local dev). */
export function getPublicSiteHref(): string {
  const raw = process.env.NEXT_PUBLIC_LIVE_URL?.trim();
  if (!raw) return '/';
  return raw.replace(/\/$/, '');
}

export const SEO_DETAILS = {
  title: {
    default: 'OHEJUIRA - Multimedia Platform & Content Hub',
    template: '%s | OHEJUIRA',
  },
  description:
    'OHEJUIRA is a dynamic multimedia platform featuring music categories, top charts, recent uploads, download metrics, and diverse content. Explore music, audio content, resources, promotional services, and a vendor marketplace. Serving humanity through innovation in entertainment and technology.',
  ogDesc:
    'Discover a vibrant multimedia platform with music categories, trending charts, recent uploads, and download metrics. Explore diverse content, connect with creators, and access resources on OHEJUIRA.',
  metadataBase: new URL(liveUrl),
  alternates: {
    canonical: liveUrl,
  },
  image: `https://static.ojmultimedia.com/favicon.png`,
  icons: `/favicon.png`,
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
  authors: [{ name: 'Edward-Precious Omegbu', url: 'https://portfolio-codegigu.vercel.app' }],
  keywords: [
    'OHEJUIRA',
    'OHEJUIRA-Multimedia',
    'Music Platform',
    'Music Categories',
    'Top Charts',
    'Music Downloads',
    'Audio Content',
    'Multimedia Platform',
    'Content Hub',
    'Music Streaming',
    'Download Metrics',
    'Recent Uploads',
    'Music Discovery',
    'Content Creation',
    'Production Services',
    'Vendor Marketplace',
    'Entertainment',
    'Digital Media',
    'Creative Platform',
    'Content Distribution',
  ],
  generator: 'Next.js',
  publisher: 'OHEJUIRA-Multimedia',
  category: 'Multimedia & Entertainment',
  classification:
    'Dynamic multimedia platform featuring music categories, charts, recent uploads, and download metrics. Serving humanity through innovation in entertainment and technology.',
};
