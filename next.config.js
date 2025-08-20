/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuration ultra-minimale pour éviter ChunkLoadError
  reactStrictMode: true,
  poweredByHeader: false,
  // Base path pour GitHub Pages (sera modifié selon votre nom de repo)
  basePath: process.env.NODE_ENV === 'production' ? '/afriquadis-diagnostic' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/afriquadis-diagnostic/' : '',
};

module.exports = nextConfig;