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
  const rawName = headerSafe(body.name) || 'Website visitor';
  const rawSubject = headerSafe(body.subject, 150) || 'Contact form';
  const rawPhone = headerSafe(body.phone, 40);
  const rawMessage = String(body.message ?? '').slice(0, 5000);
  const [name, phone, subject, message] = [rawName, rawPhone, rawSubject, rawMessage].map(escapeHtml);

  let mailer;
  try {
    mailer = getMailer();
  } catch (err) {
    console.error('[contact] mail not configured:', err);
    return NextResponse.json({ success: false, error: 'Email is not configured.' }, { status: 500 });
  }
  const { transporter, account, replyTo } = mailer;

  // 1) Notification to BHI. Reply-To is the visitor so staff can just hit Reply.
  try {
    await transporter.sendMail({
      from: { name: `${rawName} via BHI website`, address: account },
      to: account,
      replyTo: { name: rawName, address: email },
      subject: `New Contact Form Submission: ${rawSubject}`,
      text: `Name: ${rawName}\nEmail: ${email}\nPhone: ${rawPhone || '-'}\nSubject: ${rawSubject}\n\n${rawMessage}`,
      html: wrapHtml(`
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Phone:</strong> ${phone || '-'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`),
    });
  } catch (error) {
    console.error('[contact] failed to send notification to BHI:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
  }

  // 2) Auto-reply to the visitor. A failure here (bad address, remote rejection) is logged
  //    but doesn't fail the request: BHI already has the message.
  try {
    await transporter.sendMail({
      from: { name: 'Boost Health Initiative', address: account },
      to: email,
      replyTo,
      subject: 'Thank you for contacting Boost Health Initiative',
      text: `Dear ${rawName},\n\nThank you for reaching out to Boost Health Initiative. We have received your message and will get back to you soon.\n\nBest regards,\nThe Boost Health Initiative Team`,
      html: wrapHtml(`
        <h2>Thank you for contacting Boost Health Initiative</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to Boost Health Initiative. We have received your message and will get back to you soon.</p>
        <p style="margin-top: 24px;">Best regards,<br/>The Boost Health Initiative Team</p>`),
    });
  } catch (error) {
    console.error('[contact] auto-reply failed (notification was sent):', error);
  }
  return NextResponse.json({ success: true });
}
