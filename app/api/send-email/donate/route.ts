export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { EMAIL_RE, escapeHtml, getMailer, headerSafe, wrapHtml } from '@/lib/server-mail';

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const email = String(body.email ?? '').trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  const rawName = headerSafe(body.name) || 'Donor';
  const rawPhone = headerSafe(body.phone, 40);
  const rawAmount = headerSafe(body.amount, 40);
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
