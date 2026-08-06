import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CATALOG_TAG } from "@/lib/data/catalog";
import { DEVICES_TAG } from "@/lib/data/devices";
import { env } from "@/lib/env";

const tags: Record<string, string> = {
  [CATALOG_TAG]: CATALOG_TAG,
  [DEVICES_TAG]: DEVICES_TAG,
};

/**
 * Lets a price change be pushed without a redeploy. Guarded by a shared secret
 * compared in constant time so a wrong guess leaks nothing through timing.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured" },
      { status: 503 },
    );
  }

  const provided = request.headers.get("authorization")?.replace(/^Bearer /, "");

  if (!provided || !safeEqual(provided, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requested = new URL(request.url).searchParams.get("tag") ?? CATALOG_TAG;
  const tag = tags[requested];

  if (!tag) {
    return NextResponse.json({ error: "Unknown tag" }, { status: 400 });
  }

  // `{ expire: 0 }` — an external caller pushing a price change needs the old
  // copy gone now, not at the end of its cache profile.
  revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: tag });
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let mismatch = 0;

  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}
