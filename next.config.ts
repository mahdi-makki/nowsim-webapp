import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // `lib/heroes.ts` reads these folders with `fs` at runtime. The paths are
  // built at runtime, so the tracer cannot infer them and the files would
  // otherwise be missing from the server bundle.
  outputFileTracingIncludes: {
    "/*": [
      "public/images/countries/**/*",
      "public/images/global/**/*",
      "public/images/regions/**/*",
    ],
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [{ protocol: "https", hostname: "cdn.yesim.app" }],
  },
};

export default nextConfig;
