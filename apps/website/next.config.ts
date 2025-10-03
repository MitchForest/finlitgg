import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@guap/design', '@guap/shared'],
};

export default nextConfig;

