import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false, // or true if you want React Compiler

  turbopack: {
    root: path.join(__dirname, '../../'), // adjust if needed
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Proxy API requests to central API Gateway
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },

  // If you have other experimental features, put them here
  experimental: {},
};

export default nextConfig;