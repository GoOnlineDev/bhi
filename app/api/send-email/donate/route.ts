export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { EMAIL_RE, escapeHtml, getMailer, headerSafe, wrapHtml } from '@/lib/server-mail';

export async function POST(req: Request) {
  // What this does: nothing is stored and no payment is taken. It emails BHI the donor's
  // details (Reply-To = donor, so staff can reply directly) and sends the donor a confirmation.
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const email = String(body.email ?? '').trim();
  const rawName = headerSafe(body.name);
  const rawPhone = headerSafe(body.phone, 40);
  const amountNum = Number(String(body.amount ?? '').replace(/[,\s]/g, ''));

  // Validate everything up front and return per-field messages the form can show.
  const fieldErrors: Record<string, string> = {};
  if (rawName.length < 2) fieldErrors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Please enter a valid email address.';
  if (rawPhone.replace(/[^\d]/g, '').length < 9) fieldErrors.phone = 'Please enter a phone number we can reach you on.';
  if (!Number.isFinite(amountNum) || amountNum < 1000) fieldErrors.amount = 'Please enter an amount of at least UGX 1,000.';
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ success: false, error: 'Please check the highlighted fields.', fieldErrors }, { status: 400 });
  }
  const rawAmount = Math.round(amountNum).toLocaleString('en-US');
  const rawMessage = String(body.message ?? '').slice(0, 5000);
  const [name, phone, amount, message] = [rawName, rawPhone, rawAmount, rawMessage].map(escapeHtml);

  let mailer;
  try {
    mailer = getMailer();
  } catch (err) {
    console.error('[donate] mail not configured:', err);
    return NextResponse.json({ success: false, error: 'Email is not configured.' }, { status: 500 });
  }
  const { transporter, account, replyTo } = mailer;

  try {
    await transporter.sendMail({
      from: { name: `${rawName} via BHI website`, address: account },
      to: account,
      replyTo: { name: rawName, address: email },
      subject: `New Donation Pledge: UGX ${rawAmount}`,
      text: `Name: ${rawName}\nEmail: ${email}\nPhone: ${rawPhone || '-'}\nAmount: UGX ${rawAmount}\n\n${rawMessage}`,
      html: wrapHtml(`
        <h2>New Donation Pledge</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Phone:</strong> ${phone || '-'}</p>
        <p><strong>Amount:</strong> UGX ${amount}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`),
    });
  } catch (error) {
    console.error('[donate] failed to send notification to BHI:', error);
    return NextResponse.json({ success: false, error: 'Failed to send donation email.' }, { status: 500 });
  }

  try {
    // The form records a pledge; no payment is taken on the site, so the reply says so.
    await transporter.sendMail({
      from: { name: 'Boost Health Initiative', address: account },
      to: email,
      replyTo,
      subject: 'Thank you for supporting Boost Health Initiative',
      text: `Dear ${rawName},\n\nThank you for pledging UGX ${rawAmount} to Boost Health Initiative. Our team will contact you shortly with the next steps to complete your donation.\n\nBest regards,\nThe Boost Health Initiative Team`,
      html: wrapHtml(`
        <h2>Thank you for your support!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for pledging <strong>UGX ${amount}</strong> to Boost Health Initiative. Our team will contact you shortly with the next steps to complete your donation.</p>
        <p style="margin-top: 24px;">Best regards,<br/>The Boost Health Initiative Team</p>`),
    });
  } catch (error) {
    console.error('[donate] auto-reply failed (notification was sent):', error);
  }
  return NextResponse.json({ success: true });
}
