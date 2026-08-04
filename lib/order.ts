import { getDestination, type Destination } from "@/lib/destinations";
import {
  MAX_ESIMS,
  formatTotal,
  parsePrice,
  type Plan,
} from "@/lib/plans";

export type Order = {
  destination: Destination;
  plan: Plan;
  quantity: number;
  unitPrice: string;
  total: string;
};

type SearchParams = { [key: string]: string | string[] | undefined };

export function checkoutHref(
  destinationSlug: string,
  planId: string,
  quantity: number,
): string {
  const params = new URLSearchParams({
    destination: destinationSlug,
    plan: planId,
    qty: String(quantity),
  });

  return `/checkout?${params}`;
}

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function clampQuantity(raw: string | undefined): number {
  const parsed = Math.trunc(Number(raw));

  if (!Number.isFinite(parsed)) return 1;

  return Math.min(MAX_ESIMS, Math.max(1, parsed));
}

export function resolveOrder(searchParams: SearchParams): Order | undefined {
  const destination = getDestination(one(searchParams.destination) ?? "");

  if (!destination) return undefined;

  const planId = one(searchParams.plan);
  const plan = destination.plans.find((candidate) => candidate.id === planId);

  if (!plan) return undefined;

  const quantity = clampQuantity(one(searchParams.qty));

  return {
    destination,
    plan,
    quantity,
    unitPrice: plan.price,
    total: formatTotal(parsePrice(plan.price) * quantity),
  };
}
