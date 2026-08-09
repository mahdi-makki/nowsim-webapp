import "server-only";

import { toEsims } from "@/lib/api/mappers";
import { userResponseSchema } from "@/lib/api/schemas";
import { fetchYesim } from "@/lib/api/yesim";
import { verifySession } from "@/lib/auth/dal";
import { getPlanIndex } from "@/lib/data/catalog";
import type { Esim } from "@/lib/types";

/**
 * Every eSIM on the signed-in account, newest need first. `null` means nobody
 * is signed in — the caller decides what that looks like.
 *
 * Never cached: it is one user's data, keyed by a session cookie.
 */
export async function getEsims(): Promise<Esim[] | null> {
  const session = await verifySession();

  if (!session) return null;

  const [user, plans] = await Promise.all([
    fetchYesim("user", userResponseSchema, { user_id: session.yesimUserId }),
    getPlanIndex(),
  ]);

  return toEsims(user.esims, plans);
}
