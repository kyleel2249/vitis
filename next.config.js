/** @type {import('next').NextConfig} */

// Replit preview domains (dev only) so the Next.js dev server allows their requests
const replitDevDomain = process.env.REPLIT_DEV_DOMAIN || '';
const replitDomains = process.env.REPLIT_DOMAINS || '';
const allowedDevOrigins = [
  '127.0.0.1',
  'localhost',
  ...(replitDevDomain ? [replitDevDomain] : []),
  ...(replitDomains ? replitDomains.split(',').map((d) => d.trim()).filter(Boolean) : []),
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fakestoreapi.com' },
    ],
    // Cloudflare Workers cannot run sharp: set IMAGES_UNOPTIMIZED=true for that target.
    unoptimized: process.env.IMAGES_UNOPTIMIZED === 'true',
  },
  serverExternalPackages: ['pg', 'bcryptjs', 'stripe', 'stripe-replit-sync'],
  eslint: { ignoreDuringBuilds: true },
  allowedDevOrigins,
};

module.exports = nextConfig;
