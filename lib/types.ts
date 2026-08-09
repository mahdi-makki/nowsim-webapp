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
  /** Yesim's pre-migration numeric id. Older eSIMs still report it as their
   *  `active_plan_id`, so it is what names the plan on the eSIMs page. */
  legacyId?: string;
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
  /** Carrier names the eSIM roams onto, pooled from every plan and sorted. */
  operators: string[];
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

/**
 * `active` — a plan is running on it.
 * `ready` — installed or installable, but no plan is running.
 * `expired` — its last plan has run out.
 * `removed` — deleted from the device or from the account upstream.
 */
export type EsimState = "active" | "ready" | "expired" | "removed";

export type EsimUsage = {
  usedMb: number;
  totalMb: number;
  leftMb: number;
};

/** What the catalog knows about the plan an eSIM is running. */
export type PlanRef = {
  destination: string;
  href: string;
  data: string;
  days: number;
};

export type Esim = {
  id: string;
  iccid: string;
  state: EsimState;
  /** Absent when the running plan's id is no longer in the catalog. */
  plan?: PlanRef;
  activatedAt?: string;
  expiresAt?: string;
  /** Whole days until `expiresAt`, floored at 0. Computed server-side so the
   *  browser cannot render a different number than the HTML it hydrates. */
  daysLeft?: number;
  usage?: EsimUsage;
  /** The `LPA:1$...` string a phone needs to install the eSIM by hand. */
  activationCode?: string;
  /** Data-URI PNG of the same code, straight from Yesim. */
  qrImage?: string;
  iosTapLink?: string;
  /** Last radio Yesim saw it on, e.g. "4G - LTE". */
  network?: string;
};

export const esimStateLabels: Record<EsimState, string> = {
  active: "Active",
  ready: "Ready to use",
  expired: "Expired",
  removed: "Removed",
};

export function isArchivedEsim(esim: Esim): boolean {
  return esim.state === "expired" || esim.state === "removed";
}
