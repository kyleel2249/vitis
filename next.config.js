/** @type {import('next').NextConfig} */

// Collect all Replit preview domains so Next.js dev server allows their requests
const replitDevDomain = process.env.REPLIT_DEV_DOMAIN || '';
const replitDomains = process.env.REPLIT_DOMAINS || '';
const allowedDevOrigins = [
  '127.0.0.1',
  'localhost',
  ...replitDevDomain ? [replitDevDomain] : [],
  ...replitDomains ? replitDomains.split(',').map(d => d.trim()).filter(Boolean) : [],
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fakestoreapi.com' },
    ],
    unoptimized: false,
  },
  serverExternalPackages: ['pg', 'bcryptjs', 'stripe', 'stripe-replit-sync'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins,
};

module.exports = nextConfig;
