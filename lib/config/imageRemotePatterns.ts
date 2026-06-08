import type { RemotePattern } from 'next/dist/shared/lib/image-config';

/** Hostnames allowed for Next.js Image optimization (`/_next/image`). */
export const IMAGE_REMOTE_PATTERNS: RemotePattern[] = [
  {
    protocol: 'https',
    hostname: 'static.ojmultimedia.com',
  },
  {
    protocol: 'https',
    hostname: '**.r2.dev',
  },
  {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
  },
];

export const BLOCKED_IMAGE_REMOTE_HOSTS = ['malicious.example.com'] as const;
