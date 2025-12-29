import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.petroleumstationbd.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
