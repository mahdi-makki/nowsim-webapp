import type { DestinationKind } from "@/lib/types";

export const featuredSlugs: Record<DestinationKind, string[]> = {
  country: [
    "united-states",
    "united-kingdom",
    "france",
    "italy",
    "spain",
    "japan",
    "turkey",
    "united-arab-emirates",
    "thailand",
  ],

  region: [
    "europe",
    "north-america",
    "asia-pacific",
    "middle-east",
    "latin-america",
    "balkans",
  ],

  global: ["global-package", "global-lite"],
};

export const fallbackCount: Record<DestinationKind, number> = {
  country: 9,
  region: 6,
  global: 3,
};
