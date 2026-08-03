import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PlanPicker } from "@/components/sections/destination/PlanPicker";
import { ArrowLeft } from "@/components/ui/ArrowLeft";
import { Pressable } from "@/components/ui/Pressable";
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

  const { name, art, hero, blurb, kind, covers, plans } = destination;

  return (
    <section className="px-3 py-20 md:px-4 md:py-28">
      <div className="mx-auto max-w-7xl">
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

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-sheet bg-surface-soft">
            <Image
              src={hero}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
              priority
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="flex items-center gap-5 text-h1 font-extrabold tracking-[-0.045em]">
              {/* Decorative — the heading text right beside it carries the name */}
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

            <p className="mt-5 max-w-[52ch] text-lg text-muted md:text-xl">
              {blurb}
            </p>

            {kind !== "country" && covers ? (
              <p className="mt-4 text-base font-medium text-ink">
                Covers {covers} countries
              </p>
            ) : null}

            <h2 className="mt-12 text-xl font-bold tracking-[-0.02em]">
              Get an eSIM data plan for {name}
            </h2>

            <PlanPicker plans={plans} destinationName={name} />
          </div>
        </div>
      </div>
    </section>
  );
}
