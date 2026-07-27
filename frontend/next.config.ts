import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/images/**',
      },
      {
        protocol: 'https',
        hostname: 'protospace-backend.onrender.com',
        pathname: '/api/images/**',
      },
    ],
  },

  /* バックエンドへのプロキシ設定 */
  async rewrites() {
    // rewrites 実行時に毎回環境変数を動的評価し、ビルド時の固定化を防止
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/prototypes/:id/delete',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;