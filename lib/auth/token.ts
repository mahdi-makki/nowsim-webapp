import "server-only";

import { EncryptJWT, jwtDecrypt } from "jose";
import { z } from "zod";

import { sessionKey } from "@/lib/auth/env";

const payloadSchema = z.object({
  email: z.string().min(1),
  yesimUserId: z.string().min(1),
  provider: z.enum(["google", "email"]),
  issuedAt: z.number().int().positive(),
  /** Last time the user actually proved who they are with a code. Not the same
   *  as `issuedAt`: a step-up re-auth moves this and leaves the rest alone. */
  authAt: z.number().int().positive(),
  /** Session id. Names this one token so it can be revoked before it expires. */
  sid: z.string().min(1),
});

export type Session = z.infer<typeof payloadSchema>;

/** No request in this long and the session is gone. Slides as the user browses. */
export const IDLE_MS = 14 * 24 * 60 * 60 * 1000;

/** Ceiling measured from first sign-in. Activity never extends it. */
export const ABSOLUTE_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * How long proving identity counts for. Browsing runs on the long session above;
 * anything that hands over a credential asks for a code again once this lapses,
 * so a stolen cookie is worth minutes on the things worth stealing, not weeks.
 */
const FRESH_MS = 10 * 60 * 1000;

export function isFresh(session: Session): boolean {
  return Date.now() - session.authAt < FRESH_MS;
}

/** Floor on how often the cookie is rewritten, so a busy tab isn't re-issuing constantly. */
const REFRESH_AFTER_MS = 60 * 60 * 1000;

const production = process.env.NODE_ENV === "production";

export const COOKIE = production ? "__Host-nowsim_session" : "nowsim_session";

export const cookieOptions = {
  httpOnly: true,
  secure: production,
  sameSite: "lax",
  path: "/",
} as const;

export async function encryptSession(session: Session): Promise<string> {
  return new EncryptJWT(session)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + IDLE_MS))
    .encrypt(sessionKey());
}

export type Decoded = {
  session: Session;
  tokenIssuedAt: number;
};

/**
 * Crypto only — no network. Proving the token decrypts is not proof the session
 * is still live; `readSession` adds the revocation check on top of this.
 */
export async function decryptSession(
  token: string | undefined,
): Promise<Decoded | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtDecrypt(token, sessionKey(), {
      contentEncryptionAlgorithms: ["A256GCM"],
      keyManagementAlgorithms: ["dir"],
    });

    const parsed = payloadSchema.safeParse(payload);

    if (!parsed.success) return null;

    if (Date.now() - parsed.data.issuedAt > ABSOLUTE_MS) return null;

    return {
      session: parsed.data,
      tokenIssuedAt: typeof payload.iat === "number" ? payload.iat * 1000 : 0,
    };
  } catch {
    return null;
  }
}

export function needsRefresh(tokenIssuedAt: number): boolean {
  return Date.now() - tokenIssuedAt >= REFRESH_AFTER_MS;
}
