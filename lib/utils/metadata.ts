import { Metadata } from 'next';
import { SEO_DETAILS } from '@/lib/constants/texts';

export type DetailShareMetadataInput = {
  title: string;
  description: string;
  /** Site path, e.g. `/music/abc123` */
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: 'website' | 'article' | 'music.song';
};

/** Absolute URL for Open Graph / Twitter images (social crawlers require absolute URLs). */
export function resolveShareImageUrl(image?: string | null): string {
  const trimmed = image?.trim();
  if (!trimmed) {
    return SEO_DETAILS.image;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  return new URL(path, SEO_DETAILS.metadataBase).toString();
}

function resolveCanonicalUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return new URL(normalizedPath, SEO_DETAILS.metadataBase).toString();
}

/**
 * Full share metadata for content detail pages (overrides root layout openGraph / twitter).
 */
export function buildDetailShareMetadata(input: DetailShareMetadataInput): Metadata {
  const title = input.title.trim();
  const description = input.description.trim();
  const canonical = resolveCanonicalUrl(input.path);
  const imageUrl = resolveShareImageUrl(input.image);
  const imageAlt = input.imageAlt?.trim() || title;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: input.type ?? 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * Generates standardized page metadata with consistent formatting
 * @param title - Page title (will be suffixed with default template)
 * @param description - Page description
 * @param keywords - Page keywords (string or array, will be merged with base keywords)
 * @param options - Optional metadata overrides
 */
export function generatePageMetadata(
  title: string,
  description: string,
  keywords?: string | string[],
  options?: {
    titleTemplate?: string;
    image?: string;
    url?: string;
  }
): Metadata {
  const baseKeywords = SEO_DETAILS.keywords || [];
  const pageKeywords = Array.isArray(keywords) ? keywords : keywords ? keywords.split(',') : [];

  const mergedKeywords = Array.from(
    new Set([...pageKeywords, ...baseKeywords].map(k => k.trim()).filter(Boolean))
  );

  const titleTemplate = options?.titleTemplate || SEO_DETAILS.title.template;
  const fullTitle = {
    default: title,
    template: titleTemplate,
  };

  return {
    title: fullTitle,
    description: description.trim(),
    keywords: mergedKeywords.join(', '),
    ...(options?.image && {
      openGraph: {
        images: [{ url: options.image }],
      },
      twitter: {
        images: options.image,
      },
    }),
    ...(options?.url && {
      alternates: {
        canonical: options.url,
      },
    }),
  };
}
