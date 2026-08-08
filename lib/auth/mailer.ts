import "server-only";

import { Resend } from "resend";

import { authEnv } from "@/lib/auth/env";

let client: Resend | null = null;

function body(code: string, minutes: number) {
  const text = [
    `Your nowsim authorization code is ${code}.`,
    `It expires in ${minutes} minutes and can be used once.`,
    "If you did not ask to sign in, ignore this email — nobody can get in without the code.",
  ].join("\n\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0a2233;line-height:1.5">
      <p style="margin:0 0 24px">Your nowsim authorization code:</p>
      <p style="margin:0 0 24px;font-size:32px;font-weight:700;letter-spacing:0.2em">${code}</p>
      <p style="margin:0 0 24px">It expires in ${minutes} minutes and can be used once.</p>
      <p style="margin:0;color:#5a6b78;font-size:14px">
        If you did not ask to sign in, ignore this email.
      </p>
    </div>
  `;

  return { text, html };
}

export async function sendOtpEmail(
  email: string,
  code: string,
  expiresIn: number,
): Promise<void> {
  const env = authEnv();
  const minutes = Math.round(expiresIn / 60);

  if (!env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "RESEND_API_KEY is missing — refusing to sign anyone in without delivering the code.",
      );
    }

    console.info(
      `\n  nowsim OTP for ${email}: ${code}  (expires in ${minutes}m)\n`,
    );

    return;
  }

  client ??= new Resend(env.RESEND_API_KEY);

  const { text, html } = body(code, minutes);

  const { error } = await client.emails.send({
    from: env.AUTH_EMAIL_FROM,
    to: email,
    subject: `${code} is your nowsim authorization code`,
    text,
    html,
  });

  if (error) {
    throw new Error(
      `Resend refused the message: ${error.name} — ${error.message}`,
    );
  }
}
