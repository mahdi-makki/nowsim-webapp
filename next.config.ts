import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires an explicit allowlist; 75 alone mushes fine detail
    // (grass, foliage) after the re-encode to WebP/AVIF.
    qualities: [75, 90],
  },
};

export default nextConfig;
