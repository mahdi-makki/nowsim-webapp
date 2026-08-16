import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  redirects() {
    return Promise.resolve([
      { source: "/how-to-install", destination: "/help", permanent: true },
      {
        source: "/how-to-install/ios",
        destination: "/help/install-ios",
        permanent: true,
      },
      {
        source: "/how-to-install/android",
        destination: "/help/install-android",
        permanent: true,
      },
    ]);
  },
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
