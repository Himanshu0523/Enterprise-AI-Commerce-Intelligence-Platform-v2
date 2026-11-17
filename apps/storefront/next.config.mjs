import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  turbopack: {
    root: path.join(__dirname, '../../'),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    const configuredGateway = process.env.NEXT_PUBLIC_GATEWAY_URL;
    const gateway = configuredGateway || (
      process.env.NODE_ENV === 'production'
        ? 'https://api-gateway-xu2v.onrender.com'
        : 'http://localhost:8000'
    );
    const gatewayBase = new URL(gateway);
    return [{
      source: '/api/:path*',
      destination: gatewayBase.origin + '/api/:path*',
    }];
  },
};

export default nextConfig;
