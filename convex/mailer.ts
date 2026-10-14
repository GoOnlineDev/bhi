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

/** Builds the SMTP transporter from Convex env vars. Throws a clear error if they are missing. */
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
    auth: { user, pass },
  });
}

export type Recipient = { _id: any; email: string; unsubscribeToken?: string };

/**
 * Sends one email per subscriber so each gets a personal unsubscribe link
 * (and a List-Unsubscribe header, which Gmail/Yahoo now require for bulk mail).
 * Returns the number of successful sends.
 */
export async function sendToSubscribers(
  recipients: (Recipient & { unsubscribeToken: string })[],
  subject: string,
  bodyHtml: string,
): Promise<{ sent: number; failed: number }> {
  const transporter = createTransport();
  const from = `"Boost Health Initiative" <${process.env.EMAIL}>`;
  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    const unsubUrl = `${siteUrl()}/unsubscribe?token=${encodeURIComponent(r.unsubscribeToken)}`;
    const html = `${bodyHtml}
      <p style="margin-top:32px;font-size:13px;color:#888;">You are receiving this because you subscribed to Boost Health Initiative updates.
      <a href="${unsubUrl}" style="color:#888;">Unsubscribe</a></p></div>`;
    try {
      await transporter.sendMail({
        from,
        to: r.email,
        subject,
        html,
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>`,
        },
      });
      sent++;
    } catch (err) {
      failed++;
      console.error(`Failed to send to subscriber ${r._id}:`, err);
    }
  }
  return { sent, failed };
}
