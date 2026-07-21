/** @type {import('next').NextConfig} */
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
  allowedDevOrigins: ['*'],
};

module.exports = nextConfig;
