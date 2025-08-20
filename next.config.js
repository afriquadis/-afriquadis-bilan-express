/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuration simplifiée pour GitHub Pages
  reactStrictMode: true,
  poweredByHeader: false,
  // Pas de basePath pour éviter les problèmes de CSS
  basePath: '',
  assetPrefix: '',
  // Désactiver temporairement le type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;