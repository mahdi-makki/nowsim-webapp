import "server-only";

import { redis } from "@/lib/auth/redis";
import { ABSOLUTE_MS } from "@/lib/auth/token";

// The session cookie is a self-contained token: once issued, nothing can stop a
// copy of it from decrypting until it expires. Signing out therefore has to name
// the dead session here. Entries only need to outlive the token that could still
// present them, and session ids are never reused, so the absolute lifetime is a
// safe TTL.
const TTL_SECONDS = Math.ceil(ABSOLUTE_MS / 1000);

function key(sid: string): string {
  return `session:revoked:${sid}`;
}

export async function revokeSession(sid: string): Promise<void> {
  await redis().set(key(sid), 1, { ex: TTL_SECONDS });
}

export async function isRevoked(sid: string): Promise<boolean> {
  return (await redis().exists(key(sid))) === 1;
}
