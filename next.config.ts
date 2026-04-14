import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['media.gaqno.com.br'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Tenant-Domain',
            value: 'shop.gaqno.com.br',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
