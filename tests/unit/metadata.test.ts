import { describe, expect, it } from 'vitest';
import { buildDetailShareMetadata, resolveShareImageUrl } from '@/lib/utils/metadata';
import { SEO_DETAILS } from '@/lib/constants/texts';
import { URL } from 'url';

describe('resolveShareImageUrl', () => {
  it('returns default SEO image when cover is missing or blank', () => {
    expect(resolveShareImageUrl()).toBe(SEO_DETAILS.image);
    expect(resolveShareImageUrl(null)).toBe(SEO_DETAILS.image);
    expect(resolveShareImageUrl('')).toBe(SEO_DETAILS.image);
    expect(resolveShareImageUrl('   ')).toBe(SEO_DETAILS.image);
  });

  it('passes through absolute URLs', () => {
    const url = 'https://static.ojmultimedia.com/production-files/music/abc/image/cover.jpg';

    expect(resolveShareImageUrl(url)).toBe(url);
  });

  it('prefixes root-relative paths with metadataBase', () => {
    expect(resolveShareImageUrl('/images/cover.jpg')).toBe(
      new URL('/images/cover.jpg', SEO_DETAILS.metadataBase).toString()
    );
  });

  it('prefixes bare paths with metadataBase', () => {
    expect(resolveShareImageUrl('images/cover.jpg')).toBe(
      new URL('/images/cover.jpg', SEO_DETAILS.metadataBase).toString()
    );
  });
});

describe('buildDetailShareMetadata', () => {
  it('sets openGraph and twitter fields for social crawlers', () => {
    const cover = 'https://static.ojmultimedia.com/favicon.png';

    const meta = buildDetailShareMetadata({
      title: 'Turbulence by Asake - Music',
      description: 'Enjoy this piece from Asake',
      path: '/music/69fc9415a458bb52cba3588e',
      image: cover,
      imageAlt: 'Turbulence',
      type: 'music.song',
    });

    const canonical = new URL(
      '/music/69fc9415a458bb52cba3588e',
      SEO_DETAILS.metadataBase
    ).toString();

    expect(meta.title).toBe('Turbulence by Asake - Music');
    expect(meta.description).toBe('Enjoy this piece from Asake');
    expect(meta.alternates?.canonical).toBe(canonical);
    expect(meta.openGraph?.title).toBe('Turbulence by Asake - Music');
    expect(meta.openGraph?.description).toBe('Enjoy this piece from Asake');
    expect(meta.openGraph?.url).toBe(canonical);
    // expect(meta.openGraph?.type).toBe('music.song');
    expect(meta.openGraph?.images).toEqual([
      { url: cover, width: 1200, height: 630, alt: 'Turbulence' },
    ]);
    // expect(meta.twitter?.card).toBe('summary_large_image');
    expect(meta.twitter?.title).toBe('Turbulence by Asake - Music');
    expect(meta.twitter?.description).toBe('Enjoy this piece from Asake');
    expect(meta.twitter?.images).toEqual([cover]);
  });

  it('falls back to default image and title alt when cover is absent', () => {
    const meta = buildDetailShareMetadata({
      title: 'Track - Music',
      description: 'Listen now',
      path: 'music/track-id',
    });

    expect(meta.openGraph?.images).toEqual([
      { url: SEO_DETAILS.image, width: 1200, height: 630, alt: 'Track - Music' },
    ]);
    expect(meta.twitter?.images).toEqual([SEO_DETAILS.image]);
  });

  it('includes article openGraph fields when provided', () => {
    const meta = buildDetailShareMetadata({
      title: 'Story - News',
      description: 'Excerpt',
      path: '/news/story/abc',
      image: '/news/cover.jpg',
      type: 'article',
      publishedTime: '2026-05-01',
      authors: ['Editor'],
    });

    type OpenGraph = {
      type: string;
      publishedTime?: string;
      authors?: string[];
      images?: { url: string }[];
    };

    expect((meta.openGraph as OpenGraph)?.type).toBe('article');
    expect((meta.openGraph as OpenGraph)?.publishedTime).toBe('2026-05-01');
    expect((meta.openGraph as OpenGraph)?.authors).toEqual(['Editor']);
    expect((meta.openGraph as OpenGraph)?.images?.[0]?.url).toBe(
      new URL('/news/cover.jpg', SEO_DETAILS.metadataBase).toString()
    );
  });
});
