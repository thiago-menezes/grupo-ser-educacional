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
};

export default nextConfig;
