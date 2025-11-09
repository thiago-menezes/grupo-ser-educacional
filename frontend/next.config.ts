import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  transpilePackages: ['reshaped'],
  experimental: {
    optimizePackageImports: ['reshaped'],
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
