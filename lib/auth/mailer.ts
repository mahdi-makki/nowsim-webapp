import "server-only";

import { deliver, escapeHtml, FONT } from "@/lib/mail/send";

function body(email: string, code: string, minutes: number) {
  const year = new Date().getUTCFullYear();

  const text = [
    "Verify your email address",
    `Your nowsim confirmation code is: ${code}`,
    `Use this temporary code to finish signing in. It expires in ${minutes} minutes and can be used once.`,
    "If you received this email in error, you can safely ignore it. Nobody can sign in without the code.",
    `Account email: ${email}`,
    `Copyright © ${year} nowsim. All rights reserved.`,
  ].join("\n\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f2f4f5">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f4f5">
      <tr>
        <td align="center" style="padding:32px 12px">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff">
            <tr>
              <td style="padding:40px 40px 0">
                <span style="${FONT};font-size:28px;font-weight:700;color:#0a2233;letter-spacing:-0.02em">nowsim</span>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 40px 0">
                <h1 style="${FONT};margin:0;font-size:22px;font-weight:400;color:#0a2233">
                  Verify your email address
                </h1>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:24px 40px 0;font-size:15px;line-height:1.5;color:#0a2233">
                Dear traveller, your nowsim confirmation code is:
              </td>
            </tr>

            <tr>
              <td style="padding:20px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="${FONT};background:#f2f4f5;padding:14px 26px;font-size:26px;font-weight:400;letter-spacing:0.3em;color:#0a2233">
                      ${code}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:24px 40px 0;font-size:15px;line-height:1.5;color:#0a2233">
                Use this temporary code to finish signing in on the nowsim website.
                It expires in ${minutes} minutes and can be used once.
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:40px 40px 0;font-size:13px;line-height:1.6;color:#8a97a0">
                If you received this email in error, you can safely ignore i
                nobody can sign in without the code.
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:20px 40px 0;font-size:13px;line-height:1.6;color:#5a6b78">
                Account email: ${escapeHtml(email)}
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:44px 40px 40px;font-size:12px;color:#8a97a0" align="center">
                Copyright © ${year} nowsim. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { text, html };
}

export async function sendOtpEmail(
  email: string,
  code: string,
  expiresIn: number,
): Promise<void> {
  const minutes = Math.round(expiresIn / 60);
  const { text, html } = body(email, code, minutes);

  const sent = await deliver({
    to: email,
    subject: `${code} is your nowsim confirmation code`,
    text,
    html,
  });

  if (sent) return;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "RESEND_API_KEY is missing. Refusing to sign anyone in without delivering the code.",
    );
  }

  console.info(
    `\n  nowsim OTP for ${email}: ${code}  (expires in ${minutes}m)\n`,
  );
}
