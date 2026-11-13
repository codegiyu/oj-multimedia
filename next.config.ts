import type { NextConfig } from 'next';
import { IMAGE_REMOTE_PATTERNS } from './lib/config/imageRemotePatterns';

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },

  // Mark @react-email/render as external to prevent build-time analysis
  // This avoids React 19 compatibility issues during build
  serverExternalPackages: ['@react-email/render'],

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize @react-email/render for server bundle to avoid React 19 compatibility issues
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@react-email/render');
      } else {
        config.externals = [config.externals, '@react-email/render'];
      }
    }
    return config;
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', 'date-fns'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' https:",
              "connect-src 'self' https:",
              "frame-src https://accounts.google.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/music/albums',
        destination: '/music/albums/all',
        permanent: true,
      },
      {
        source: '/community/resources',
        destination: '/community/resources/all',
        permanent: true,
      },
      {
        source: '/community/artists',
        destination: '/community/artists/all',
        permanent: true,
      },
    ];
  },
};

function withOptionalBundleAnalyzer(config: NextConfig): NextConfig {
  if (process.env.ANALYZE !== 'true') {
    return config;
  }

  // Dev-only: production images omit devDependencies (see Dockerfile prod-deps stage).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bundleAnalyzer = require('@next/bundle-analyzer').default as (
    options: { enabled: boolean }
  ) => (config: NextConfig) => NextConfig;

  return bundleAnalyzer({ enabled: true })(config);
}

export default withOptionalBundleAnalyzer(nextConfig);
