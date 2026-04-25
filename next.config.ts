import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['media.gaqno.com.br'],
  },
  transpilePackages: ['@gaqno-development/frontcore'],
};

export default nextConfig;
