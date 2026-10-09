import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-dimitris-eshop.pantheonsite.io",
      },
    ],
  },
};

export default nextConfig;