import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { toDestinations } from "@/lib/api/mappers";
import { plansResponseSchema } from "@/lib/api/schemas";
import { fetchYesim } from "@/lib/api/yesim";
import {
  fallbackCount,
  featuredSlugs,
  spotlightCount,
  spotlightSlugs,
} from "@/lib/featured";
import type {
  Destination,
  DestinationKind,
  DestinationSummary,
  PlanRef,
} from "@/lib/types";
import { destinationHref, toSummary } from "@/lib/types";

export const CATALOG_TAG = "catalog";

export async function getDestinations(): Promise<Destination[]> {
  "use cache";

  cacheLife({ stale: 300, revalidate: 1800, expire: 86_400 });
  cacheTag(CATALOG_TAG);

  const plans = await fetchYesim("plans", plansResponseSchema);

  return toDestinations(plans);
}

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

export async function getSpotlightSummaries(): Promise<DestinationSummary[]> {
  const available = await getSummariesByKind("country");
  const bySlug = new Map(available.map((entry) => [entry.slug, entry]));

  const picked = spotlightSlugs
    .map((slug) => bySlug.get(slug))
    .filter((entry): entry is DestinationSummary => entry !== undefined);

  return picked.length ? picked : available.slice(0, spotlightCount);
}

export async function getPlanIndex(): Promise<Map<string, PlanRef>> {
  const destinations = await getDestinations();

  const index = new Map<string, PlanRef>();

  for (const destination of destinations) {
    for (const plan of destination.plans) {
      const ref: PlanRef = {
        destination: destination.name,
        href: destinationHref(destination.kind, destination.slug),
        art: destination.art,
        data: plan.data,
        days: plan.days,
      };

      index.set(plan.id, ref);

      if (plan.legacyId) index.set(plan.legacyId, ref);
    }
  }

  return index;
}

export async function getDestinationParams(): Promise<
  { kind: DestinationKind; slug: string }[]
> {
  const destinations = await getDestinations();

  return destinations.map(({ kind, slug }) => ({ kind, slug }));
}
