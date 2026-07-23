import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', // SpringBootのポート番号
        pathname: '/api/images/**',
      },
    ],
  },
};

export default nextConfig;
