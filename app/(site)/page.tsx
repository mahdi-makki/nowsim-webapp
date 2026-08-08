import { Hero } from "@/components/sections/home/Hero";
import { Destinations } from "@/components/sections/home/Destinations";
import { About } from "@/components/sections/home/About";
import { HowItWorks } from "@/components/sections/home/HowItWorks";
import { Faq } from "@/components/common/Faq";
import {
  getDestinationSummaries,
  getFeaturedSummaries,
} from "@/lib/data/catalog";
import type { DestinationKind, DestinationSummary } from "@/lib/types";

export default async function HomePage() {
  const [[country, region, global], destinations] = await Promise.all([
    Promise.all(
      (["country", "region", "global"] as const).map(getFeaturedSummaries),
    ),
    getDestinationSummaries(),
  ]);

  const previews: Record<DestinationKind, DestinationSummary[]> = {
    country,
    region,
    global,
  };

  return (
    <>
      <Hero destinations={destinations} />
      <Destinations previews={previews} />
      <About />
      <HowItWorks />
      <Faq />
    </>
  );
}
