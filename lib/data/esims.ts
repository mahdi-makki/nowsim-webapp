import "server-only";

import { toEsims } from "@/lib/api/mappers";
import { userResponseSchema } from "@/lib/api/schemas";
import { fetchYesim } from "@/lib/api/yesim";
import { verifyFreshSession, verifySession } from "@/lib/auth/dal";
import { getPlanIndex } from "@/lib/data/catalog";
import type { Esim } from "@/lib/types";

/**
 * An activation code is the eSIM: anyone holding it can install the plan on their
 * own phone. So it never rides along with the listing — a session that has not
 * proved identity in the last few minutes sees the eSIM and its usage, but gets
 * the credential stripped and a flag telling the UI to ask for a code first.
 */
function withoutCredentials(esim: Esim): Esim {
  const { activationCode, qrImage, iosTapLink, ...rest } = esim;
  const had = Boolean(activationCode || qrImage || iosTapLink);

  return had ? { ...rest, installLocked: true } : rest;
}

/**
 * Every eSIM on the signed-in account, newest need first. `null` means nobody
 * is signed in — the caller decides what that looks like.
 *
 * Never cached: it is one user's data, keyed by a session cookie.
 */
export async function getEsims(): Promise<Esim[] | null> {
  const session = await verifySession();

  if (!session) return null;

  const [user, plans, fresh] = await Promise.all([
    fetchYesim("user", userResponseSchema, { user_id: session.yesimUserId }),
    getPlanIndex(),
    verifyFreshSession(),
  ]);

  const esims = toEsims(user.esims, plans);

  return fresh ? esims : esims.map(withoutCredentials);
}
