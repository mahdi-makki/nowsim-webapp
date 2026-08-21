import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Every prerender worker fills the catalog cache in its own process, so
    // splitting these pages across many workers means many concurrent copies
    // of the same slow ~750KB `plans` download, each slowing the others down
    // until they overrun the 50s `use cache` fill cap. Keep them together.
    staticGenerationMinPagesPerWorker: 1000,
  },
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
