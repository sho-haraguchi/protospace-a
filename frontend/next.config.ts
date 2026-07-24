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
  async redirects() {
    return [
      {
        source: '/prototypes/:id/delete', // /prototypes/10/delete へのアクセスを検知
        destination: '/',                  // トップページへ転送
        permanent: false,
      },
    ];
  },
};

export default nextConfig;