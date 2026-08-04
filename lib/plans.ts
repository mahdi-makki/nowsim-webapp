import { slugify } from "@/lib/slugify";

export type Plan = {
  id: string;
  data: string;
  days: number;
  price: string;
};

const CURRENCY = "$";

export const MAX_ESIMS = 10;

export function parsePrice(price: string): number {
  const amount = Number(price.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(amount)) {
    throw new Error(`Unparseable price: ${price}`);
  }

  return amount;
}

export function formatTotal(amount: number): string {
  return `${CURRENCY}${amount.toFixed(2)}`;
}

function formatPrice(amount: number): string {
  const whole = Math.floor(amount);
  const cents = amount - whole;
  const ending = Math.abs(cents - 0.49) < Math.abs(cents - 0.99) ? 0.49 : 0.99;

  return `${CURRENCY}${(whole + ending).toFixed(2)}`;
}

export type PlanProfile = "country" | "bundle";

type Tier = { data: string; days: number; multiplier: number };

type Ladder = {
  tiers: Tier[];
  unlimited: { days: number; multiplier: number }[];
};

const ladders: Record<PlanProfile, Ladder> = {
  country: {
    tiers: [
      { data: "3 GB", days: 30, multiplier: 1.75 },
      { data: "5 GB", days: 30, multiplier: 2.5 },
      { data: "10 GB", days: 30, multiplier: 4 },
      { data: "20 GB", days: 30, multiplier: 5.75 },
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
      { data: "20 GB", days: 30, multiplier: 2.6 },
    ],
    unlimited: [
      { days: 7, multiplier: 2.4 },
      { days: 15, multiplier: 3.2 },
      { days: 30, multiplier: 4.4 },
    ],
  },
};

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
      id: slugify(base.data),
      data: base.data,
      days: base.days,
      price: from,
    },
    ...tiers.map((tier) => ({
      id: slugify(tier.data),
      data: tier.data,
      days: tier.days,
      price: formatPrice(anchor * tier.multiplier),
    })),
    ...unlimited.map((tier) => ({
      id: `unlimited-${tier.days}`,
      data: "Unlimited",
      days: tier.days,
      price: formatPrice(anchor * tier.multiplier),
    })),
  ];
}