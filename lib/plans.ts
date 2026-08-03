import { slugify } from "@/lib/slugify";

export type PlanDuration = {
  days: number;
  price: string;
};

export type Plan = {
  /** Stable across renders — radio value, React key, and future cart line id */
  id: string;
  /** "1 GB", "Unlimited" */
  data: string;
  /** One entry renders as static text; several render a duration picker */
  durations: PlanDuration[];
  /** Highlighted card in the picker */
  best?: boolean;
};

const CURRENCY = "US$";

export function parsePrice(price: string): number {
  const amount = Number(price.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(amount)) {
    throw new Error(`Unparseable price: ${price}`);
  }

  return amount;
}

/** Plain money — for totals, where charm rounding would be a lie */
export function formatTotal(amount: number): string {
  return `${CURRENCY}${amount.toFixed(2)}`;
}

/**
 * Charm pricing — snap to whichever of .49 / .99 the raw figure is nearer, so
 * a generated ladder reads like the hand-set anchors rather than like maths
 */
function formatPrice(amount: number): string {
  const whole = Math.floor(amount);
  const cents = amount - whole;
  const ending = Math.abs(cents - 0.49) < Math.abs(cents - 0.99) ? 0.49 : 0.99;

  return `${CURRENCY}${(whole + ending).toFixed(2)}`;
}

/**
 * A country's anchor prices 1 GB; a region or global anchor already prices a
 * multi-country bundle. Running the country curve off a bundle anchor gives
 * absurd figures (Europe unlimited at US$170), so bundles get a flatter one.
 */
export type PlanProfile = "country" | "bundle";

type Tier = { data: string; days: number; multiplier: number; best?: boolean };

type Ladder = {
  /** Metered tiers above the anchor */
  tiers: Tier[];
  /** Unlimited is one plan sold in three lengths, not three plans */
  unlimited: { days: number; multiplier: number }[];
};

const ladders: Record<PlanProfile, Ladder> = {
  // Reverse-engineered from the priced reference sheet — 1 GB at US$3.99 →
  // 3/5/10/20 GB at 6.99/9.99/15.99/22.99, unlimited 15 days at 48.99
  country: {
    tiers: [
      { data: "3 GB", days: 30, multiplier: 1.75 },
      { data: "5 GB", days: 30, multiplier: 2.5 },
      { data: "10 GB", days: 30, multiplier: 4 },
      { data: "20 GB", days: 30, multiplier: 5.75, best: true },
    ],
    unlimited: [
      { days: 7, multiplier: 7.5 },
      { days: 15, multiplier: 12.28 },
      { days: 30, multiplier: 19 },
    ],
  },
  bundle: {
    tiers: [
      { data: "5 GB", days: 30, multiplier: 1.35 },
      { data: "10 GB", days: 30, multiplier: 1.8 },
      { data: "20 GB", days: 30, multiplier: 2.6, best: true },
    ],
    unlimited: [
      { days: 7, multiplier: 2.4 },
      { days: 15, multiplier: 3.2 },
      { days: 30, multiplier: 4.4 },
    ],
  },
};

/** The anchor buys less data on a bundle than it does in a single country */
const anchorTier: Record<PlanProfile, { data: string; days: number }> = {
  country: { data: "1 GB", days: 7 },
  bundle: { data: "3 GB", days: 30 },
};

export function buildPlans(from: string, profile: PlanProfile): Plan[] {
  const anchor = parsePrice(from);
  const { tiers, unlimited } = ladders[profile];
  const base = anchorTier[profile];

  return [
    {
      // The anchor is carried through verbatim so a destination's "From" line
      // in the listing always matches its cheapest plan on the detail page
      id: slugify(base.data),
      data: base.data,
      durations: [{ days: base.days, price: from }],
    },
    ...tiers.map((tier) => ({
      id: slugify(tier.data),
      data: tier.data,
      best: tier.best,
      durations: [
        { days: tier.days, price: formatPrice(anchor * tier.multiplier) },
      ],
    })),
    {
      id: "unlimited",
      data: "Unlimited",
      durations: unlimited.map((tier) => ({
        days: tier.days,
        price: formatPrice(anchor * tier.multiplier),
      })),
    },
  ];
}