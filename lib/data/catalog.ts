import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { toDestinations } from "@/lib/api/mappers";
import { plansResponseSchema } from "@/lib/api/schemas";
import { fetchYesim } from "@/lib/api/yesim";
import { fallbackCount, featuredSlugs } from "@/lib/featured";
import type {
  Destination,
  DestinationKind,
  DestinationSummary,
  Plan,
} from "@/lib/types";
import { toSummary } from "@/lib/types";

export const CATALOG_TAG = "catalog";

/**
 * One upstream call serves the whole catalog for the cache window. Everything
 * below derives from this array in memory — no endpoint is hit per destination.
 */
export async function getDestinations(): Promise<Destination[]> {
  "use cache";

  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const plans = await fetchYesim("plans", plansResponseSchema);

  return toDestinations(plans);
}

/**
 * Kind-scoped because slugs are only unique within a kind — there is both a
 * country "japan" and a region "japan".
 */
export async function getDestination(
  kind: DestinationKind,
  slug: string,
): Promise<Destination | undefined> {
  const destinations = await getDestinations();

  return destinations.find(
    (destination) => destination.kind === kind && destination.slug === slug,
  );
}

export async function getDestinationSummaries(): Promise<DestinationSummary[]> {
  const destinations = await getDestinations();

  return destinations.map(toSummary);
}

export async function getSummariesByKind(
  kind: DestinationKind,
): Promise<DestinationSummary[]> {
  const destinations = await getDestinations();

  return destinations
    .filter((destination) => destination.kind === kind)
    .map(toSummary);
}

/**
 * The home page rail. Order comes from `lib/featured.ts`, not from the catalog,
 * so it stays hand-picked. Unknown slugs are skipped; an empty result falls
 * back to catalog order so the section is never blank.
 */
export async function getFeaturedSummaries(
  kind: DestinationKind,
): Promise<DestinationSummary[]> {
  const available = await getSummariesByKind(kind);
  const bySlug = new Map(available.map((entry) => [entry.slug, entry]));

  const picked = featuredSlugs[kind]
    .map((slug) => bySlug.get(slug))
    .filter((entry): entry is DestinationSummary => entry !== undefined);

  return picked.length ? picked : available.slice(0, fallbackCount[kind]);
}

/** Feeds `generateStaticParams` for `/destinations/[kind]/[slug]`. */
export async function getDestinationParams(): Promise<
  { kind: DestinationKind; slug: string }[]
> {
  const destinations = await getDestinations();

  return destinations.map(({ kind, slug }) => ({ kind, slug }));
}

export async function getPlan(planId: string): Promise<Plan | undefined> {
  const destinations = await getDestinations();

  for (const destination of destinations) {
    const plan = destination.plans.find((entry) => entry.id === planId);

    if (plan) return plan;
  }

  return undefined;
}
