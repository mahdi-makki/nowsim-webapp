import type { Metadata } from "next";

import { AllDestinations } from "@/components/sections/destinations/AllDestinations";
import { ArrowLeft } from "@/components/ui/ArrowLeft";
import { Pressable } from "@/components/ui/Pressable";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "All destinations | nowsim",
  description:
    "Browse nowsim data plans across 200+ countries, regional bundles, and global plans. Pick a destination and connect the moment you land.",
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
        <Pressable
          href="/"
          className={cn(
            "group mb-10 gap-2 rounded-full border border-hairline px-6 py-3.5",
            "text-base font-medium text-ink",
            "hover:border-ink/25 hover:bg-surface-soft",
            "active:border-ink/25 active:bg-surface-soft",
          )}
        >
          <ArrowLeft
            className={cn(
              "h-4 w-4 transition-[translate] duration-300 ease-hover",
              "group-hover:-translate-x-0.5 motion-reduce:transition-none",
            )}
          />
          Back to home
        </Pressable>

        <h1 className="max-w-[14ch] text-h1 font-extrabold uppercase tracking-[-0.045em]">
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
