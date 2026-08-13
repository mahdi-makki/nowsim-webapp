import "server-only";

import { Resend } from "resend";

import { authEnv } from "@/lib/auth/env";

let client: Resend | null = null;

export const FONT = "font-family:Arial,Helvetica,sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type Attachment = { filename: string; content: string };

export type Message = {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Attachment[];
};

/**
 * One way out to Resend. Returns `false` when no API key is configured, which
 * only happens in development — the caller decides whether that is fatal.
 */
export async function deliver(message: Message): Promise<boolean> {
  const env = authEnv();

  if (!env.RESEND_API_KEY) return false;

  client ??= new Resend(env.RESEND_API_KEY);

  const { error } = await client.emails.send({
    from: env.AUTH_EMAIL_FROM,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
    attachments: message.attachments,
  });

  if (error) {
    throw new Error(
      `Resend refused the message: ${error.name} — ${error.message}`,
    );
  }

  return true;
}
