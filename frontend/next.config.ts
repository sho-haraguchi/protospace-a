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

  async rewrites() {
    const rawUrl =
      process.env.BACKEND_URL ||
      process.env.INTERNAL_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8080';

    const baseUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
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