import "server-only";

import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

import { sessionKey } from "@/lib/auth/env";

const payloadSchema = z.object({
  email: z.string().min(1),
  yesimUserId: z.string().min(1),
  provider: z.enum(["google", "email"]),
  issuedAt: z.number().int().positive(),
});

export type Session = z.infer<typeof payloadSchema>;

const IDLE_MS = 7 * 24 * 60 * 60 * 1000;

const ABSOLUTE_MS = 30 * 24 * 60 * 60 * 1000;

const REFRESH_AFTER_MS = 24 * 60 * 60 * 1000;

const production = process.env.NODE_ENV === "production";

const COOKIE = production ? "__Host-nowsim_session" : "nowsim_session";

const cookieOptions = {
  httpOnly: true,
  secure: production,
  sameSite: "lax",
  path: "/",
} as const;

async function encrypt(session: Session): Promise<string> {
  return new EncryptJWT(session)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + IDLE_MS))
    .encrypt(sessionKey());
}

type Decoded = {
  session: Session;
  tokenIssuedAt: number;
};

async function decodeCookie(): Promise<Decoded | null> {
  const token = (await cookies()).get(COOKIE)?.value;

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

export async function readSession(): Promise<Session | null> {
  return (await decodeCookie())?.session ?? null;
}

export async function createSession(
  session: Omit<Session, "issuedAt">,
): Promise<void> {
  const issuedAt = Date.now();
  const token = await encrypt({ ...session, issuedAt });

  (await cookies()).set(COOKIE, token, {
    ...cookieOptions,
    expires: new Date(issuedAt + IDLE_MS),
  });
}

export async function refreshSession(): Promise<Session | null> {
  const decoded = await decodeCookie();

  if (!decoded) return null;

  if (Date.now() - decoded.tokenIssuedAt < REFRESH_AFTER_MS) {
    return decoded.session;
  }

  (await cookies()).set(COOKIE, await encrypt(decoded.session), {
    ...cookieOptions,
    expires: new Date(Date.now() + IDLE_MS),
  });

  return decoded.session;
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
