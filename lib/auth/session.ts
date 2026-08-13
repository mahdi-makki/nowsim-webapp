import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

import { isRevoked, revokeSession } from "@/lib/auth/revocation";
import {
  COOKIE,
  cookieOptions,
  decryptSession,
  encryptSession,
  IDLE_MS,
  type Session,
} from "@/lib/auth/token";

export type { Session };

/**
 * The authoritative read. Everything that reaches real data goes through the DAL
 * and lands here, so this is where a revoked session actually dies. `proxy.ts`
 * deliberately skips the revocation lookup: it runs ahead of every route and a
 * Redis round trip there would tax navigation for a check this already covers.
 */
export async function readSession(): Promise<Session | null> {
  const decoded = await decryptSession((await cookies()).get(COOKIE)?.value);

  if (!decoded) return null;

  if (await isRevoked(decoded.session.sid)) return null;

  return decoded.session;
}

export async function createSession(
  session: Omit<Session, "issuedAt" | "authAt" | "sid">,
): Promise<void> {
  const issuedAt = Date.now();

  await write({ ...session, issuedAt, authAt: issuedAt, sid: randomUUID() });
}

/**
 * Step-up: the user has just proved identity again on a session that was already
 * signed in. Only the freshness stamp moves — reusing the id and `issuedAt`
 * keeps the absolute ceiling anchored to the original sign-in, so re-auth can
 * never be chained into an endless session.
 */
export async function markReauthenticated(): Promise<Session | null> {
  const session = await readSession();

  if (!session) return null;

  const stamped: Session = { ...session, authAt: Date.now() };

  await write(stamped);

  return stamped;
}

async function write(payload: Session): Promise<void> {
  (await cookies()).set(COOKIE, await encryptSession(payload), {
    ...cookieOptions,
    expires: new Date(Date.now() + IDLE_MS),
  });
}

/**
 * Clearing the cookie only disarms the browser doing the signing out. Revoking
 * the id is what makes a copied token useless everywhere else.
 */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const decoded = await decryptSession(store.get(COOKIE)?.value);

  if (decoded) await revokeSession(decoded.session.sid);

  store.delete(COOKIE);
}
