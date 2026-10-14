"use node";
import nodemailer from "nodemailer";

export function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function siteUrl(): string {
  return (process.env.SITE_URL || "https://www.boosthealthinitiative.com").replace(/\/$/, "");
}

/** Recipients per action run. Kept small so throttled sending fits in Convex's action time limit. */
export const BATCH_SIZE = 200;
/** Delay between messages: keeps us well under Gmail SMTP rate limits. */
const THROTTLE_MS = 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Gmail SMTP transporter built from Convex env vars. Throws a clear error if they are missing. */
export function createTransport() {
  const user = process.env.EMAIL;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) {
    throw new Error("EMAIL and EMAIL_PASSWORD must be set in the Convex dashboard (Settings → Environment Variables).");
  }
  const port = Number(process.env.EMAIL_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 1,
    maxMessages: 100,
  });
}

export type Recipient = { _id: string; email: string; unsubscribeToken: string };

/**
 * One email per subscriber (never a shared BCC), each with:
 *  - From = the authenticated Gmail account (Gmail rewrites/flags any other From),
 *  - Reply-To = REPLY_TO_EMAIL or the same account,
 *  - a plain-text alternative alongside the HTML,
 *  - a personal unsubscribe link and List-Unsubscribe header (Gmail/Yahoo bulk-sender rules).
 * Sends are throttled; each failure is logged and counted, never thrown.
 */
export async function sendToSubscribers(
  recipients: Recipient[],
  subject: string,
  bodyHtml: string,
  bodyText: string,
): Promise<{ sent: number; failed: number }> {
  const transporter = createTransport();
  const account = process.env.EMAIL!;
  const from = { name: "Boost Health Initiative", address: account };
  const replyTo = process.env.REPLY_TO_EMAIL || account;
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i];
    const unsubUrl = `${siteUrl()}/unsubscribe?token=${encodeURIComponent(r.unsubscribeToken)}`;
    const html = `${bodyHtml}
      <p style="margin-top:32px;font-size:13px;color:#888;">You are receiving this because you subscribed to Boost Health Initiative updates.
      <a href="${unsubUrl}" style="color:#888;">Unsubscribe</a></p></div>`;
    const text = `${bodyText}\n\n--\nYou are receiving this because you subscribed to Boost Health Initiative updates.\nUnsubscribe: ${unsubUrl}\n`;
    try {
      await transporter.sendMail({
        from,
        to: r.email,
        replyTo,
        subject,
        text,
        html,
        list: {
          unsubscribe: [{ url: unsubUrl, comment: "Unsubscribe" }, `mailto:${replyTo}?subject=unsubscribe`],
        },
      });
      sent++;
    } catch (err) {
      failed++;
      console.error(`Newsletter send failed for subscriber ${r._id}:`, err instanceof Error ? err.message : err);
    }
    if (i < recipients.length - 1) await sleep(THROTTLE_MS);
  }
  transporter.close();
  console.log(`Newsletter "${subject}": sent=${sent} failed=${failed}`);
  return { sent, failed };
}
