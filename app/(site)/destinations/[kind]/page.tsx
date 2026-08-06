import { notFound, redirect } from "next/navigation";

import { destinationKinds, isDestinationKind } from "@/lib/types";

/**
 * `/destinations/country` is a real URL now that it is a route segment — a
 * breadcrumb points at it and people chop URLs. The filtered list already lives
 * on `/destinations`, so this hands over rather than duplicating it.
 */
export function generateStaticParams() {
  return destinationKinds.map((kind) => ({ kind }));
}

export default async function DestinationKindPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;

  if (!isDestinationKind(kind)) notFound();

  redirect(`/destinations?kind=${kind}`);
}
