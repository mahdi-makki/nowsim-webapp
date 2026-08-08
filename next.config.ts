import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    qualities: [75, 90],
    remotePatterns: [{ protocol: "https", hostname: "cdn.yesim.app" }],
  },
};

export default nextConfig;
