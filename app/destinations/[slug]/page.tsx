import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CoverageButton } from "@/components/sections/destination/CoverageButton";
import { PlanPicker } from "@/components/sections/destination/PlanPicker";
import { Faq } from "@/components/sections/Faq";
import { ArrowLeft } from "@/components/ui/ArrowLeft";
import { Pressable } from "@/components/ui/Pressable";
import { TrustBar } from "@/components/ui/TrustBar";
import { destinationSlugs, getDestination } from "@/lib/destinations";
import { cn } from "@/lib/cn";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return destinationSlugs.map((slug) => ({ slug }));
}

// Every destination is known at build time, so an unknown slug is a 404 rather
// than something worth rendering on demand
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) return {};

  return {
    title: `${destination.name} eSIM | nowsim`,
    description: destination.blurb,
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) notFound();

  const { name, art, hero, blurb, kind, coversList, plans } = destination;

  // The nav pill sits at the top on every page but home, so small screens need
  // the extra headroom
  return (
    <>
      {/* Faq brings its own vertical rhythm, so this one stops at the trust bar */}
      <section className="px-3 pt-28 md:px-4">
        <div className="mx-auto max-w-7xl">
          {/* 40/60 rather than an even split — the plan grid is the work of the
              page, the art is only setting. items-start so the left column keeps
              its own height and can stick */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16">
            {/* Nav pill and art ride along until the plans run out, then the
                whole section scrolls away together */}
            <div className="lg:sticky lg:top-28">
              <Pressable
                href="/destinations"
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
                All destinations
              </Pressable>

              <div className="relative aspect-square overflow-hidden rounded-sheet bg-surface-soft">
                <Image
                  src={hero}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  quality={90}
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Drops the heading to the top of the art: the pill above it is
                3.375rem tall (1.5rem line + py-3.5 + hairline) over a 2.5rem
                margin */}
            <div className="lg:pt-[5.875rem]">
              {/* A notch under text-h1 — the same curve, capped at 3rem instead
                  of 3.5rem, since it shares the row with the plan grid */}
              <h1
                className={cn(
                  "flex items-center gap-5 font-extrabold tracking-[-0.045em]",
                  "text-[clamp(2rem,1.4rem+2.6vw,3rem)] leading-[1.03]",
                )}
              >
                {/* Decorative — the heading beside it carries the name */}
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink/8">
                  <Image
                    src={art}
                    alt=""
                    fill
                    sizes="48px"
                    unoptimized={art.endsWith(".svg")}
                    className="object-cover"
                  />
                </span>
                {name} eSIM
              </h1>

              <p className="mt-5 max-w-[52ch] text-base font-medium text-muted md:text-lg">
                {blurb}
              </p>

              {kind !== "country" && coversList?.length ? (
                <CoverageButton
                  destinationName={name}
                  countries={coversList}
                />
              ) : null}

              <h2 className="mt-12 text-xl font-bold tracking-[-0.02em]">
                Get an eSIM data plan for {name}
              </h2>

              <PlanPicker plans={plans} destinationName={name} />
            </div>
          </div>

          <TrustBar
            tone="light"
            className="mt-28 border-y border-hairline py-10 lg:mt-36"
          />
        </div>
      </section>

      <Faq />
    </>
  );
}
