import type { NextConfig } from 'next';

// When deploying to GitHub Pages the site lives at /Coffee-order/
// Set NEXT_PUBLIC_BASE_PATH='' (empty) for a custom domain or Vercel.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Coffee-order';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;
