import path from 'node:path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  // Scope Turbopack to this project. Without it, it walks up and finds a stray
  // package-lock.json in the home directory and warns on every build.
  turbopack: { root: path.join(import.meta.dirname) },
  reactStrictMode: true,
  // Cache Components: `use cache` scopes join the prerendered shell, and a CMS
  // webhook invalidates them by tag. See src/content/cached.ts.
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    // Mid-range Android on patchy data is the target. AVIF first, and a
    // device ladder that starts low rather than at desktop widths.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      // Contentstack asset CDNs, enabled only when that adapter is in use.
      { protocol: 'https', hostname: 'images.contentstack.io' },
      { protocol: 'https', hostname: 'eu-images.contentstack.com' },
    ],
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};

export default config;
