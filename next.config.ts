import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
    // Ensure server components can use external packages
    serverActions: {
      bodySizeLimit: '2mb',
    },
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
