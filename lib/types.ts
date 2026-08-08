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
  days: number;
  price: Money;
};

export type CoveredCountry = {
  name: string;
  art?: string;
};

export type DestinationSummary = {
  slug: string;
  name: string;
  kind: DestinationKind;
  art: string;
  from: Money;
  covers?: number;
};

export type Destination = DestinationSummary & {
  hero: string;
  blurb: Blurb;
  coversList?: CoveredCountry[];
  plans: Plan[];
  apn?: string;
};

export function toSummary(destination: Destination): DestinationSummary {
  const { slug, name, kind, art, from, covers } = destination;

  return { slug, name, kind, art, from, covers };
}

export type DeviceGroup = {
  id: string;
  label: string;
  devices: string[];
};
