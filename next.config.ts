import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
      ignoreDuringBuilds: true, // Completely ignores ESLint during 'next build'
  },
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "colorless-dinosaur-524.convex.cloud",
      }
    ]
  }
};

export default nextConfig;
