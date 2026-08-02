import type { Metadata } from "next";

import { AllDestinations } from "@/components/sections/destinations/AllDestinations";

export const metadata: Metadata = {
  title: "All destinations | NOWSIM",
  description:
    "Browse NOWSIM data plans across 200+ countries, regional bundles, and global plans. Pick a destination and connect the moment you land.",
};

export default async function AllDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Read on the server so the filtered list ships in the HTML — useSearchParams
  // would bail the whole listing out to client-side rendering
  const q = (await searchParams).q;
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");

  return (
    <section className="px-3 py-20 md:px-4 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h1 className="max-w-[14ch] text-h1 uppercase tracking-[-0.045em] subpixel-antialiased [-webkit-text-stroke:0.022em_currentColor]">
          All destinations
        </h1>

        <p className="mt-5 max-w-[52ch] text-lg text-muted md:text-xl">
          Find the best data plan in over 200 destinations — one account,
          instant activation, and no roaming bill wherever you go.
        </p>

        <AllDestinations initialQuery={initialQuery} />
      </div>
    </section>
  );
}
