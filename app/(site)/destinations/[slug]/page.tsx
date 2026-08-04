import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CoverageBlurb } from "@/components/sections/destination/CoverageBlurb";
import { PlanPicker } from "@/components/sections/destination/PlanPicker";
import { Faq } from "@/components/sections/Faq";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TrustBar } from "@/components/ui/TrustBar";
import {
  blurbText,
  destinationSlugs,
  getDestination,
  kindLabels,
} from "@/lib/destinations";
import { cn } from "@/lib/cn";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return destinationSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) return {};

  return {
    title: `${destination.name} eSIM | nowsim`,
    description: blurbText(destination.blurb),
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) notFound();

  const { name, art, hero, blurb, kind, coversList, plans } = destination;

  return (
    <>
      <section className="px-3 pt-28 md:px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <Breadcrumb
                className="mb-10"
                items={[
                  { label: "eSIM card for travel", href: "/" },
                  {
                    label: kindLabels[kind],
                    href: `/destinations?kind=${kind}`,
                  },
                  { label: name },
                ]}
              />

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

            <div className="lg:pt-[4.5rem]">
              <h1
                className={cn(
                  "flex items-center gap-5 font-extrabold tracking-[-0.045em]",
                  "text-[clamp(2rem,1.4rem+2.6vw,3rem)] leading-[1.03]",
                )}
              >
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

              <CoverageBlurb
                blurb={blurb}
                destinationName={name}
                countries={coversList}
                className="mt-5 max-w-[52ch] text-base font-medium text-muted md:text-lg"
              />

              <h2 className="mt-12 text-xl font-bold tracking-[-0.02em]">
                Get an eSIM data plan for {name}
              </h2>

              <PlanPicker
                plans={plans}
                destinationName={name}
                destinationSlug={destination.slug}
              />
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
