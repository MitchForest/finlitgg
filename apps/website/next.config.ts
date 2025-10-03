import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@finlitgg/design', '@finlitgg/shared'],
};

export default nextConfig;


