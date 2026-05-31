import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SEO_DETAILS } from '@/lib/constants/texts';
import { Providers } from '@/components/Providers';
import { ScrollRestorationHandler } from '@/components/general/ScrollRestorationHandler';
import { LoadAnimationScreenDynamic } from '@/components/general/LoadAnimationScreenDynamic';
import NextTopLoader from 'nextjs-toploader';

export async function generateMetadata(): Promise<Metadata> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, ogDesc, ...seoFields } = SEO_DETAILS;

  return {
    ...seoFields,
    openGraph: {
      title: SEO_DETAILS.title,
      description: SEO_DETAILS.ogDesc,
      type: 'website',
      url: SEO_DETAILS.metadataBase.toString(),
      siteName: SEO_DETAILS.title.default,
      images: [{ url: SEO_DETAILS.image }],
    },
    twitter: {
      card: 'summary_large_image',
      images: SEO_DETAILS.image,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'only light',
};

/** ISR: public routes inherit default tier unless overridden in nested layouts/pages. */
/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.default` (300s). */
export const revalidate = 300;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased overflow-x-hidden">
        <NextTopLoader color="hsl(var(--primary))" height={3} showSpinner={false} />
        <ScrollRestorationHandler />
        <LoadAnimationScreenDynamic />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
