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
    return [
      {
        source: '/api/:path*',
        destination: 'https://protospace-backend.onrender.com/api/:path*',
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