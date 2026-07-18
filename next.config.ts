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
};

export default nextConfig;
