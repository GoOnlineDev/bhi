import nodemailer from 'nodemailer';
import { SITE_URL } from '@/lib/site';

export const escapeHtml = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Strip CR/LF and angle brackets so user input can't break mail headers or display names. */
export const headerSafe = (v: unknown, max = 120) =>
  String(v ?? '').replace(/[\r\n<>"]/g, ' ').trim().slice(0, max);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Hosted logo instead of a file attachment. Reading /public via process.cwd() is not
// reliable in serverless deployments, and a missing file made the whole send throw.
const LOGO_URL = `${SITE_URL}/BOOST%20HEALTH%20PNG%20LOGO%20ICON%20Bckg%20TRANS.png`;

export function wrapHtml(inner: string) {
  return `<div style="font-family: Arial, Helvetica, sans-serif; color: #1c140d; max-width: 600px;">
    <img src="${LOGO_URL}" alt="Boost Health Initiative" width="60" height="60" style="height:60px;width:60px;margin-bottom:16px;" />
    ${inner}
  </div>`;
}

/** Gmail SMTP using the EMAIL / EMAIL_PASSWORD env vars. From is always that authenticated account. */
export function getMailer() {
  const user = process.env.EMAIL;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) throw new Error('EMAIL / EMAIL_PASSWORD env vars are not set');
  const port = Number(process.env.EMAIL_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
  });
  return { transporter, account: user, replyTo: process.env.REPLY_TO_EMAIL || user };
}
