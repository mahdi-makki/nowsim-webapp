import "server-only";

import { deliver, escapeHtml, FONT, type Attachment } from "@/lib/mail/send";
import type { Esim } from "@/lib/types";

const DATA_URI = /^data:image\/(png|jpeg|gif);base64,(.+)$/i;

function qrAttachment(qrImage: string | undefined): Attachment | undefined {
  const match = qrImage?.match(DATA_URI);

  if (!match) return undefined;

  return {
    filename: `nowsim-esim-qr.${match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase()}`,
    content: match[2],
  };
}

function row(label: string, value: string): string {
  return `<tr>
              <td style="${FONT};padding:0 40px 12px;font-size:13px;line-height:1.6;color:#5a6b78">
                ${escapeHtml(label)}
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 20px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="${FONT};background:#f2f4f5;padding:14px 18px;font-size:15px;line-height:1.5;color:#0a2233;word-break:break-all">
                      ${escapeHtml(value)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`;
}

function body(esim: Esim, hasQr: boolean) {
  const year = new Date().getUTCFullYear();
  const name = esim.plan ? `${esim.plan.destination} eSIM` : "Your eSIM";
  const shape = esim.plan
    ? `${esim.plan.data} · ${esim.plan.days} day${esim.plan.days === 1 ? "" : "s"}`
    : "";

  const text = [
    name,
    shape,
    esim.activationCode ? `Activation code: ${esim.activationCode}` : "",
    `ICCID: ${esim.iccid}`,
    esim.iosTapLink ? `Install on iPhone: ${esim.iosTapLink}` : "",
    hasQr
      ? "The QR code is attached. Scan it from the phone that will use the eSIM. It can only be installed once."
      : "",
    "Keep this email to yourself: anyone holding the activation code can install this eSIM.",
    `Copyright © ${year} nowsim. All rights reserved.`,
  ]
    .filter(Boolean)
    .join("\n\n");

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
                  ${escapeHtml(name)}
                </h1>
              </td>
            </tr>

            ${
              shape
                ? `<tr>
              <td style="${FONT};padding:8px 40px 0;font-size:15px;line-height:1.5;color:#5a6b78">
                ${escapeHtml(shape)}
              </td>
            </tr>`
                : ""
            }

            <tr>
              <td style="${FONT};padding:24px 40px 24px;font-size:15px;line-height:1.5;color:#0a2233">
                Here are your installation details${hasQr ? ", with the QR code attached" : ""}.
              </td>
            </tr>

            ${esim.activationCode ? row("Activation code", esim.activationCode) : ""}
            ${row("ICCID", esim.iccid)}

            ${
              esim.iosTapLink
                ? `<tr>
              <td style="padding:0 40px 20px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="${FONT};background:#0a2233;padding:14px 26px">
                      <a href="${escapeHtml(esim.iosTapLink)}" style="${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none">
                        Install on this iPhone
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
                : ""
            }

            <tr>
              <td style="${FONT};padding:20px 40px 0;font-size:13px;line-height:1.6;color:#8a97a0">
                Keep this email to yourself. Anyone holding the activation code
                can install this eSIM, and it only installs once.
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

export async function sendEsimEmail(email: string, esim: Esim): Promise<void> {
  const attachment = qrAttachment(esim.qrImage);
  const { text, html } = body(esim, Boolean(attachment));

  const sent = await deliver({
    to: email,
    subject: esim.plan
      ? `Your ${esim.plan.destination} eSIM is ready to install`
      : "Your nowsim eSIM is ready to install",
    text,
    html,
    attachments: attachment ? [attachment] : undefined,
  });

  if (sent) return;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "RESEND_API_KEY is missing. Cannot mail the eSIM install details.",
    );
  }

  console.info(`\n  nowsim eSIM ${esim.iccid} would be mailed to ${email}\n`);
}
