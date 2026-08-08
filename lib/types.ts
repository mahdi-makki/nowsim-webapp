import type { Money } from "@/lib/money";

export type DestinationKind = "country" | "region" | "global";

export type DestinationFilter = "all" | DestinationKind;

export const destinationKinds: DestinationKind[] = [
  "country",
  "region",
  "global",
];

const filters: DestinationFilter[] = ["all", ...destinationKinds];

export function isDestinationFilter(
  value: string | undefined,
): value is DestinationFilter {
  return value !== undefined && filters.includes(value as DestinationFilter);
}

export function isDestinationKind(
  value: string | undefined,
): value is DestinationKind {
  return value !== undefined && destinationKinds.includes(value as never);
}

export function destinationHref(kind: DestinationKind, slug: string): string {
  return `/destinations/${kind}/${slug}`;
}

export const kindLabels: Record<DestinationKind, string> = {
  country: "Country eSIMs",
  region: "Regional eSIMs",
  global: "Global eSIMs",
};

export type Blurb = {
  lead: string;
  coverage?: string;
  tail: string;
};

export type Plan = {
  id: string;
  data: string;
  /** Unlimited plans sort as their own group, after every fixed-data plan. */
  unlimited: boolean;
  days: number;
  price: Money;
};

export type CoveredCountry = {
  name: string;
  art?: string;
  /** ISO 3166 alpha-2 and alpha-3, so "kr" finds South Korea in a coverage list. */
  codes?: string[];
};

export type DestinationSummary = {
  slug: string;
  name: string;
  kind: DestinationKind;
  art: string;
  from: Money;
  covers?: number;
  /** ISO 3166 alpha-2 and alpha-3 for a country. Empty for regions and global. */
  codes?: string[];
  /** Names of the countries a region or global plan reaches. */
  coverage?: string[];
};

export type Destination = DestinationSummary & {
  hero: string;
  blurb: Blurb;
  coversList?: CoveredCountry[];
  plans: Plan[];
  apn?: string;
};

export function toSummary(destination: Destination): DestinationSummary {
  const { slug, name, kind, art, from, covers, codes, coverage } = destination;

  return { slug, name, kind, art, from, covers, codes, coverage };
}

export type DeviceGroup = {
  id: string;
  label: string;
  devices: string[];
};
