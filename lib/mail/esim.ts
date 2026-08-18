import "server-only";

import {
  getInstallGuide,
  installHref,
  installPlatforms,
  type InstallPlatformId,
  type InstallStep,
} from "@/lib/install";
import { deliver, escapeHtml, FONT, type Attachment } from "@/lib/mail/send";
import type { Esim } from "@/lib/types";

const DATA_URI = /^data:image\/(png|jpeg|gif);base64,(.+)$/i;

/** Mail runs outside a request, so absolute links come from the environment. */
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nowsim.app").replace(
  /\/+$/,
  "",
);

/** The HTML points at the QR attachment with src="cid:...". */
const QR_CID = "nowsim-esim-qr";

const BRAND = "#5f47eb";
const BRAND_TINT = "#efecfd";
const INK = "#0a2233";
const INK_TINT = "#f5f6f7";
const MUTED = "#5a6b78";
const FAINT = "#8a97a0";
const HAIRLINE = "#e2e4e7";

const link = `${FONT};color:${BRAND};font-weight:700;text-decoration:none`;

function qrAttachment(qrImage: string | undefined): Attachment | undefined {
  const match = qrImage?.match(DATA_URI);

  if (!match) return undefined;

  return {
    filename: `nowsim-esim-qr.${match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase()}`,
    content: match[2],
    contentId: QR_CID,
  };
}

/**
 * Step one differs from the site guide: the mail carries the QR itself and
 * never prints the activation code, so it sends manual installers to the
 * account instead. Steps two onward are the guide's, verbatim.
 */
const openingStep: Record<InstallPlatformId, InstallStep> = {
  ios: {
    title: "Install the plan",
    path: ["Settings", "Mobile Data", "Add eSIM"],
    note: "Scan the QR code at the end of this email from another screen. To type it instead, tap Enter Details Manually and copy the SM-DP+ address and activation code from Install details in My eSIMs. Leave the confirmation code empty.",
    shots: 0,
  },
  android: {
    title: "Add the eSIM",
    path: ["Settings", "Network & internet", "SIMs", "Add eSIM"],
    note: "Scan the QR code at the end of this email from another screen. To type it instead, tap Need help?, then Enter it manually and copy the activation code from Install details in My eSIMs.",
    shots: 0,
  },
};

/** Guide headings read "iOS 26 / iPhone and iPad". Mail leads with the phone. */
const platformName: Record<InstallPlatformId, string> = {
  ios: "iPhone and iPad",
  android: "Android",
};

function platformNote(platform: InstallPlatformId): string {
  const guide = getInstallGuide(platform);

  return platform === "ios" ? guide.label : guide.devices;
}

function steps(platform: InstallPlatformId): InstallStep[] {
  const guide = getInstallGuide(platform);
  const qr = guide.methods.find(({ id }) => id === "qr") ?? guide.methods[0];

  return [openingStep[platform], ...qr.steps.slice(1)];
}

function divider(): string {
  return `<tr>
              <td style="padding:32px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="height:1px;background:${HAIRLINE};line-height:1px;font-size:0">&nbsp;</td></tr>
                </table>
              </td>
            </tr>`;
}

function sectionHead(number: number, title: string): string {
  return `<tr>
              <td style="padding:28px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="28" style="${FONT};background:${INK};color:#ffffff;font-size:14px;font-weight:700;text-align:center;width:28px;height:28px;line-height:28px;border-radius:14px">${number}</td>
                    <td style="${FONT};padding-left:12px;font-size:19px;font-weight:700;letter-spacing:-0.01em;color:${INK}">${title}</td>
                  </tr>
                </table>
              </td>
            </tr>`;
}

function subLine(text: string): string {
  return `<span style="display:block;font-weight:400;line-height:1.6;color:${MUTED};padding-top:4px">
                        ${escapeHtml(text)}
                      </span>`;
}

function stepRow(step: InstallStep, index: number, last: boolean): string {
  const gap = last ? "" : "padding-bottom:16px";

  return `<tr>
                    <td width="26" valign="top" style="${FONT};width:26px;font-size:14px;line-height:1.5;color:${BRAND};font-weight:700;${gap}">${index + 1}.</td>
                    <td style="${FONT};font-size:14px;line-height:1.5;color:${INK};font-weight:700;${gap}">
                      ${escapeHtml(step.title)}
                      ${step.path ? subLine(step.path.join(" → ")) : ""}
                      ${step.note ? subLine(step.note) : ""}
                    </td>
                  </tr>`;
}

function platformBlock(platform: InstallPlatformId): string {
  const list = steps(platform);
  const href = `${SITE}${installHref(platform)}`;

  return `<tr>
              <td style="padding:28px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="${FONT};background:${INK_TINT};border-left:3px solid ${INK};padding:12px 16px;font-size:16px;font-weight:700;letter-spacing:-0.01em;color:${INK}">
                      ${escapeHtml(platformName[platform])}
                      <span style="${FONT};font-size:13px;font-weight:400;color:${MUTED}">&nbsp;${escapeHtml(platformNote(platform))}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${list
                    .map((step, index) =>
                      stepRow(step, index, index === list.length - 1),
                    )
                    .join("\n                  ")}
                </table>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:14px 40px 0;font-size:13px;line-height:1.6;color:${MUTED}">
                Full guide with screenshots:
                <a href="${href}" style="${link}">${escapeHtml(href.replace(/^https?:\/\//, ""))}</a>
              </td>
            </tr>`;
}

function stepsText(platform: InstallPlatformId): string {
  const lines = steps(platform).map((step, index) =>
    [
      `${index + 1}. ${step.title}`,
      step.path ? `   ${step.path.join(" → ")}` : "",
      step.note ? `   ${step.note}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `${platformName[platform]} (${platformNote(platform)})`,
    ...lines,
    `Full guide: ${SITE}${installHref(platform)}`,
  ].join("\n");
}

function body(esim: Esim, email: string, hasQr: boolean) {
  const year = new Date().getUTCFullYear();
  const heading = esim.plan
    ? `Let’s get your ${esim.plan.destination} eSIM running`
    : "Let’s get your eSIM running";
  const shape = esim.plan
    ? `${esim.plan.data} · ${esim.plan.days} day${esim.plan.days === 1 ? "" : "s"}`
    : "";

  const text = [
    heading,
    shape,
    "Thanks for your order. If this is your first eSIM, you need to install it and switch it on. It is easier than it sounds. Follow the steps for your phone below.",
    "BEFORE YOU START. Stay on Wi-Fi through the whole install. An eSIM installs once, on one device. A failed or repeated attempt cannot be undone.",
    "You can install anywhere: at home before you fly, or after you land. Installing does not start your plan.",
    "1. INSTALL AND SWITCH ON",
    `Quickest route: open ${SITE}/esims on the phone that will use the eSIM and tap Install details. Prefer to do it by hand? Follow your phone below.`,
    ...installPlatforms.map(stepsText),
    "Once roaming is on, it can take 5 to 10 minutes to find a network the first time.",
    "2. YOUR ACTIVATION DETAILS",
    hasQr
      ? "The QR code is attached to this email. Scan it from the phone that will use the eSIM. On iPhone with iOS 17.4 or later, press and hold the code and pick Add eSIM."
      : `Open ${SITE}/esims and tap Install details to get your QR code.`,
    esim.iosTapLink
      ? `Install on iPhone in one tap: ${esim.iosTapLink}`
      : "",
    "Keep this email to yourself. Anyone holding the activation code can install this eSIM, and it only installs once.",
    `Stuck at any step? Read ${SITE}/help or write to support@nowsim.app from this address. We answer fast.`,
    "Safe travels, the nowsim team",
    "Please do not reply to this email.",
    `Sent to ${email}`,
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
                <span style="${FONT};font-size:28px;font-weight:700;color:${INK};letter-spacing:-0.02em">nowsim</span>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 40px 0">
                <h1 style="${FONT};margin:0;font-size:26px;font-weight:700;line-height:1.2;letter-spacing:-0.02em;color:${INK}">
                  ${escapeHtml(heading)}
                </h1>
              </td>
            </tr>

            ${
              shape
                ? `<tr>
              <td style="${FONT};padding:10px 40px 0;font-size:15px;line-height:1.5;color:${MUTED}">
                ${escapeHtml(shape)}
              </td>
            </tr>`
                : ""
            }

            <tr>
              <td style="${FONT};padding:20px 40px 0;font-size:15px;line-height:1.65;color:${INK}">
                Thanks for your order. If this is your first eSIM, you need to
                install it and switch it on. It is easier than it sounds. Follow
                the steps for your phone below; your QR code is at the end of
                this email.
              </td>
            </tr>

            <tr>
              <td style="padding:24px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="${FONT};background:${BRAND_TINT};border-left:3px solid ${BRAND};padding:14px 18px;font-size:14px;line-height:1.6;color:${INK}">
                      <strong style="font-weight:700">Before you start.</strong>
                      Stay on Wi-Fi through the whole install. An eSIM installs
                      <strong style="font-weight:700">once</strong>, on
                      <strong style="font-weight:700">one device</strong>. A
                      failed or repeated attempt cannot be undone.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:16px 40px 0;font-size:14px;line-height:1.6;color:${MUTED}">
                You can install anywhere: at home before you fly, or after you
                land. Installing does not start your plan.
              </td>
            </tr>

            ${divider()}
            ${sectionHead(1, "Install and switch on")}

            <tr>
              <td style="${FONT};padding:14px 40px 0;font-size:14px;line-height:1.6;color:${MUTED}">
                Quickest route: open
                <a href="${SITE}/esims" style="${link}">My eSIMs</a>
                on the phone that will use the eSIM and tap
                <strong style="font-weight:700;color:${INK}">Install details</strong>.
                Prefer to do it by hand? Follow your phone below.
              </td>
            </tr>

            ${installPlatforms.map(platformBlock).join("\n\n            ")}

            <tr>
              <td style="${FONT};padding:20px 40px 0;font-size:14px;line-height:1.6;color:${MUTED}">
                Once roaming is on, it can take 5 to 10 minutes to find a
                network the first time.
              </td>
            </tr>

            ${divider()}
            ${sectionHead(2, "Your activation details")}

            ${
              hasQr
                ? `<tr>
              <td align="center" style="padding:24px 40px 0">
                <img src="cid:${QR_CID}" width="200" height="200" alt="eSIM QR code" style="display:block;width:200px;height:200px;border:1px solid ${HAIRLINE}" />
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:14px 40px 0;font-size:13px;line-height:1.6;color:${MUTED}" align="center">
                Scan it from the phone that will use the eSIM. On iPhone with
                iOS 17.4 or later, press and hold the code and pick
                <strong style="font-weight:700">Add eSIM</strong>.
              </td>
            </tr>`
                : `<tr>
              <td style="${FONT};padding:24px 40px 0;font-size:14px;line-height:1.6;color:${MUTED}" align="center">
                Open <a href="${SITE}/esims" style="${link}">My eSIMs</a> and tap
                Install details to get your QR code.
              </td>
            </tr>`
            }

            ${
              esim.iosTapLink
                ? `<tr>
              <td align="center" style="padding:22px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="${FONT};background:${BRAND};padding:15px 30px;border-radius:999px">
                      <a href="${escapeHtml(esim.iosTapLink)}" style="${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none">
                        Install eSIM in one tap
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:12px 40px 0;font-size:13px;line-height:1.6;color:${FAINT}" align="center">
                Works on iPhone only, from the phone that will use the eSIM.
              </td>
            </tr>`
                : ""
            }

            <tr>
              <td style="${FONT};padding:26px 40px 0;font-size:13px;line-height:1.6;color:${FAINT}">
                Keep this email to yourself. Anyone holding the activation code
                can install this eSIM, and it only installs once.
              </td>
            </tr>

            <tr>
              <td style="padding:26px 40px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="${FONT};background:${INK_TINT};padding:18px;font-size:14px;line-height:1.65;color:${INK}" align="center">
                      Stuck at any step? Read the
                      <a href="${SITE}/help" style="${link}">help centre</a>
                      or write to
                      <a href="mailto:support@nowsim.app" style="${link}">support@nowsim.app</a>
                      from this address. We answer fast.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:26px 40px 0;font-size:15px;line-height:1.6;color:${INK}" align="center">
                Safe travels,<br />
                <strong style="font-weight:700">the nowsim team</strong>
              </td>
            </tr>

            ${divider()}

            <tr>
              <td style="${FONT};padding:22px 40px 0;font-size:13px;line-height:1.8;color:${MUTED}" align="center">
                <a href="${SITE}" style="${FONT};color:${MUTED};text-decoration:none">Website</a> &nbsp;·&nbsp;
                <a href="${SITE}/help" style="${FONT};color:${MUTED};text-decoration:none">Help centre</a> &nbsp;·&nbsp;
                <a href="${SITE}/esims" style="${FONT};color:${MUTED};text-decoration:none">My eSIMs</a>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:16px 40px 0;font-size:12px;line-height:1.7;color:${FAINT}" align="center">
                Please do not reply to this email.
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:8px 40px 0;font-size:12px;line-height:1.7;color:${FAINT}" align="center">
                Sent to <span style="color:${BRAND};font-weight:700">${escapeHtml(email)}</span>
              </td>
            </tr>

            <tr>
              <td style="${FONT};padding:14px 40px 40px;font-size:12px;line-height:1.7;color:${FAINT}" align="center">
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
  const { text, html } = body(esim, email, Boolean(attachment));

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
