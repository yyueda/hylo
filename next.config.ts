import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['mongoose'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        search: '',
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh', // ✅ allow any subdomain of ufs.sh
      },
    ],
  },
};

export default nextConfig;
