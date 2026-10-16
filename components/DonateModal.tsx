'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';

type Fields = { name: string; email: string; phone: string; amount: string; message: string };
const EMPTY: Fields = { name: '', email: '', phone: '', amount: '', message: '' };

/**
 * Donation pledge form. No payment is taken and nothing is stored: the API route emails
 * BHI the donor's details (Reply-To = donor) and sends the donor a confirmation email.
 */
export default function DonateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const uid = useId();
  const [form, setForm] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const firstInput = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Reset when reopened, lock background scroll, close on Escape.
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY); setStatus('idle'); setError(''); setFieldErrors({});
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    setTimeout(() => firstInput.current?.focus(), 50);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as keyof Fields;
    setForm((f) => ({ ...f, [name]: e.target.value }));
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending'); setError(''); setFieldErrors({});
    try {
      const res = await fetch('/api/send-email/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        setStatus('success');
        return;
      }
      setFieldErrors(data.fieldErrors ?? {});
      setError(data.error || 'We could not send your details. Please try again.');
      setStatus('error');
    } catch {
      setError('Network error: please check your connection and try again.');
      setStatus('error');
    }
  }

  if (!open) return null;

  const input = 'w-full rounded-lg border px-4 py-2.5 text-base bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary';
  const field = (name: keyof Fields) => `${input} ${fieldErrors[name] ? 'border-destructive' : 'border-input'}`;
  const err = (name: keyof Fields) =>
    fieldErrors[name] ? <p id={`${uid}-${name}-err`} className="text-sm text-destructive">{fieldErrors[name]}</p> : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className="relative bg-white w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-8 overflow-y-auto max-h-[92vh]"
      >
        <button
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full text-foreground hover:bg-muted"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="py-6 text-center" role="status">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
            <h2 id={`${uid}-title`} className="text-xl font-bold text-foreground mb-2">Thank you!</h2>
            <p className="text-muted-foreground mb-2">
              We&apos;ve received your details and sent a confirmation to <strong className="break-all">{form.email}</strong>.
            </p>
            <p className="text-muted-foreground mb-6">Our team will contact you shortly with the next steps to complete your donation.</p>
            <button type="button" onClick={onClose} className="w-full rounded-lg bg-primary text-primary-foreground font-semibold px-6 py-3">
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 id={`${uid}-title`} className="text-xl sm:text-2xl font-bold mb-1 pr-8 text-foreground">Support Boost Health Initiative</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Leave your details and how much you&apos;d like to give. No payment is taken here: our team will contact you to arrange it.
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-name`} className="font-medium text-sm">Name</label>
                <input ref={firstInput} id={`${uid}-name`} name="name" autoComplete="name" value={form.name} onChange={handleChange}
                  required className={field('name')} aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? `${uid}-name-err` : undefined} />
                {err('name')}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-email`} className="font-medium text-sm">Email</label>
                <input id={`${uid}-email`} type="email" name="email" autoComplete="email" inputMode="email" value={form.email} onChange={handleChange}
                  required className={field('email')} aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? `${uid}-email-err` : undefined} />
                {err('email')}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-phone`} className="font-medium text-sm">Phone number</label>
                <input id={`${uid}-phone`} type="tel" name="phone" autoComplete="tel" inputMode="tel" value={form.phone} onChange={handleChange}
                  required className={field('phone')} aria-invalid={!!fieldErrors.phone} aria-describedby={fieldErrors.phone ? `${uid}-phone-err` : undefined} />
                {err('phone')}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-amount`} className="font-medium text-sm">Amount (UGX)</label>
                <input id={`${uid}-amount`} type="number" name="amount" inputMode="numeric" min="1000" step="500" value={form.amount} onChange={handleChange}
                  required className={field('amount')} aria-invalid={!!fieldErrors.amount} aria-describedby={fieldErrors.amount ? `${uid}-amount-err` : undefined} />
                {err('amount')}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-message`} className="font-medium text-sm">Message (optional)</label>
                <textarea id={`${uid}-message`} name="message" value={form.message} onChange={handleChange} rows={3} className={`${input} border-input resize-none`} />
              </div>

              {status === 'error' && error ? (
                <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-bold rounded-lg px-6 py-3 text-base shadow transition-colors"
              >
                {status === 'sending' ? (<><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>) : 'Send my details'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
