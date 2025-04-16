/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Pinterest
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.pinimg.com',
      },
      // Pexels
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // PayPal
      {
        protocol: 'https',
        hostname: 'www.paypalobjects.com',
      },
      
    ],
  },
};

module.exports = nextConfig;
