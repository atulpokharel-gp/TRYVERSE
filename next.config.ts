import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.phia.com",
      },
      {
        protocol: "https",
        hostname: "**.phia.co",
      },
    ],
  },
};

export default nextConfig;
