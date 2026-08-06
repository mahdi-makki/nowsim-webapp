import type { DestinationKind } from "@/lib/types";

/**
 * The client-safe half of checkout. Kept apart from `lib/order.ts` because that
 * one reaches the catalog, which reaches the API token — importing it from a
 * client component would drag the token-reading module into the browser bundle.
 */
export const MAX_ESIMS = 10;

export function checkoutHref(
  destinationKind: DestinationKind,
  destinationSlug: string,
  planId: string,
  quantity: number,
): string {
  const params = new URLSearchParams({
    kind: destinationKind,
    destination: destinationSlug,
    plan: planId,
    qty: String(quantity),
  });

  return `/checkout?${params}`;
}

export function clampQuantity(raw: string | undefined): number {
  const parsed = Math.trunc(Number(raw));

  if (!Number.isFinite(parsed)) return 1;

  return Math.min(MAX_ESIMS, Math.max(1, parsed));
}
