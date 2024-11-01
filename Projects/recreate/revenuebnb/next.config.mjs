/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '/**', // Allow all paths under this domain
          },
          {
            protocol: 'https',
            hostname: 'a0.muscache.com',
            pathname: '/im/pictures/**', // Allow all paths under this domain
          }
 
        ],
      },
 
};

export default nextConfig;
