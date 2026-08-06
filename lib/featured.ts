import type { DestinationKind } from "@/lib/types";

/**
 * The destinations shown on the home page, in the order they appear.
 *
 * This is the only place that decides it — edit these lists freely, nothing
 * sorts them. Entries are slugs: `slugify(destinationName)`, so "North America"
 * is `north-america`.
 *
 * Every slug below was checked against the live catalog. A slug that stops
 * existing is skipped rather than rendered blank. If a whole list resolves to
 * nothing, that tab falls back to catalog order so the section is never empty.
 */
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

  // The catalog's full region set is: asia, asia-pacific, balkans, cis, europe,
  // japan-region, latam, latin-america, middle-east, north-america, sea.
  region: [
    "europe",
    "north-america",
    "asia-pacific",
    "middle-east",
    "latin-america",
    "balkans",
  ],

  // Only two exist.
  global: ["global-package", "global-lite"],
};

/** Used only when a list above resolves to nothing at all. */
export const fallbackCount: Record<DestinationKind, number> = {
  country: 9,
  region: 6,
  global: 3,
};
