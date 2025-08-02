import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
