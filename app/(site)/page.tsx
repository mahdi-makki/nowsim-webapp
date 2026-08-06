import { Hero } from "@/components/sections/home/Hero";
import { Destinations } from "@/components/sections/home/Destinations";
import { About } from "@/components/sections/home/About";
import { HowItWorks } from "@/components/sections/home/HowItWorks";
import { Faq } from "@/components/common/Faq";
import { getFeaturedSummaries } from "@/lib/data/catalog";
import type { DestinationKind, DestinationSummary } from "@/lib/types";

export default async function HomePage() {
  const [country, region, global] = await Promise.all(
    (["country", "region", "global"] as const).map(getFeaturedSummaries),
  );

  const previews: Record<DestinationKind, DestinationSummary[]> = {
    country,
    region,
    global,
  };

  return (
    <>
      <Hero />
      <Destinations previews={previews} />
      <About />
      <HowItWorks />
      <Faq />
    </>
  );
}
