import "server-only";

import { readdirSync } from "node:fs";
import { extname, join } from "node:path";

import { heroPlaceholder } from "@/lib/assets";
import type { DestinationKind } from "@/lib/types";

// A destination's photo is `public/images/<folder>/<slug>.<ext>`, so dropping
// `greece.jpg` into `countries/` is all it takes to give Greece its own hero.
const folders: Record<DestinationKind, string> = {
  country: "countries",
  region: "regions",
  global: "global",
};

// Escape hatch for the cases the file name cannot cover: a destination whose
// slug does not match the photo, or several destinations sharing one image.
const overrides: Partial<Record<`${DestinationKind}:${string}`, string>> = {};

const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function scan(folder: string): Map<string, string> {
  const heroes = new Map<string, string>();

  let entries: string[];

  try {
    entries = readdirSync(join(process.cwd(), "public", "images", folder));
  } catch {
    return heroes;
  }

  for (const entry of entries) {
    const extension = extname(entry).toLowerCase();

    if (!extensions.has(extension)) continue;

    const slug = entry.slice(0, -extension.length).toLowerCase();

    heroes.set(slug, `/images/${folder}/${entry}`);
  }

  return heroes;
}

// Read once per server start — the catalog is built at request time and the
// folders only change on deploy.
const index = new Map<DestinationKind, Map<string, string>>(
  Object.entries(folders).map(([kind, folder]) => [
    kind as DestinationKind,
    scan(folder),
  ]),
);

export function heroFor(kind: DestinationKind, slug: string): string {
  return (
    overrides[`${kind}:${slug}`] ??
    index.get(kind)?.get(slug.toLowerCase()) ??
    heroPlaceholder
  );
}