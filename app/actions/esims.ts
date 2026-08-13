"use server";

import { verifyFreshSession } from "@/lib/auth/dal";
import { digest, redis } from "@/lib/auth/redis";
import { getEsims } from "@/lib/data/esims";
import { sendEsimEmail } from "@/lib/mail/esim";

export type MailState = {
  ok: boolean;
  /** Where it went, so the button can say so. Only ever the session's address. */
  email?: string;
  error?: string;
  /** The session is no longer freshly proved — the UI should step up first. */
  locked?: boolean;
  /** Inside the cooldown: nothing new went out, the earlier mail still stands. */
  throttled?: boolean;
};

const COOLDOWN_SECONDS = 60;

/**
 * Mails the install details of one eSIM to the signed-in address.
 *
 * The activation code *is* the eSIM, so this needs the same freshly-proved
 * session that showing it on screen does, and the recipient comes from the
 * session cookie — the client only picks which of its own eSIMs to send.
 */
export async function emailEsim(esimId: string): Promise<MailState> {
  const session = await verifyFreshSession();

  if (!session) {
    return {
      ok: false,
      locked: true,
      error: "Confirm it is you before we email the code.",
    };
  }

  try {
    const esims = await getEsims();
    const esim = esims?.find((entry) => entry.id === esimId);

    if (!esim) return { ok: false, error: "That eSIM is not on your account." };

    if (!esim.activationCode && !esim.qrImage) {
      return { ok: false, error: "This eSIM has no installation code left." };
    }

    // One mail a minute per eSIM: a resend is cheap for the user and the retry
    // path for a mistyped inbox is signing in again, not spamming this button.
    const claimed = await redis().set(
      `mail:esim:${digest(`${session.email}:${esim.id}`)}`,
      1,
      { nx: true, ex: COOLDOWN_SECONDS },
    );

    if (claimed !== "OK") {
      return { ok: true, email: session.email, throttled: true };
    }

    await sendEsimEmail(session.email, esim);

    return { ok: true, email: session.email };
  } catch (cause) {
    console.error("emailEsim failed:", cause);

    return { ok: false, error: "We could not send it. Try again in a moment." };
  }
}
