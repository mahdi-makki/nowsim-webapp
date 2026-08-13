import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  outputFileTracingIncludes: {
    "/*": [
      "public/images/countries/**/*",
      "public/images/global/**/*",
      "public/images/regions/**/*",
    ],
  },
  images: {
    qualities: [75, 90, 100],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.yesim.app" }],
  },
};

export default nextConfig;
