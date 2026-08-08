import "server-only";

import { cache } from "react";

import type { Account } from "@/lib/auth/account";
import { readSession, type Session } from "@/lib/auth/session";

export const verifySession = cache(async (): Promise<Session | null> => {
  return readSession();
});

export const getAccount = cache(async (): Promise<Account | null> => {
  const session = await verifySession();

  if (!session) return null;

  return {
    userId: session.yesimUserId,
    email: session.email,
    provider: session.provider,
  };
});
