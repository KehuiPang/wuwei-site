import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/zh',
        destination: '/',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/nian',
        destination: '/voice',
        permanent: true, // 301
      },
      {
        source: '/en/nian',
        destination: '/en/voice',
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;
