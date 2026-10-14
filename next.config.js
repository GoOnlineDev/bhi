/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Image optimisation was disabled (unoptimized: true), so every visitor downloaded the
  // full-size originals, which caused the long grey placeholders. It is now on: images are
  // resized per device and served as AVIF/WebP. Any https host is allowed because admins
  // can paste image URLs from anywhere.
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
