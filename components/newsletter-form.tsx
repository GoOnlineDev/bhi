'use client';

import { useId, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/** Email subscribe form (used in the footer and on news/program pages). */
export default function NewsletterForm({ className, layout = 'stacked' }: { className?: string; layout?: 'stacked' | 'inline' }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { toast } = useToast();
  const addSubscriber = useMutation(api.subscribers.addSubscriber);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setStatus(null);
    try {
      const res = (await addSubscriber({ email })) as { status?: string } | null | undefined;
      const already = res?.status === 'already_subscribed';
      toast({
        title: already ? 'Already subscribed' : 'Subscribed!',
        description: already
          ? 'This email is already on our mailing list.'
          : "Thank you! You'll get an email when we publish new news or programmes.",
      });
      setStatus({
        type: 'success',
        text: already
          ? 'You are already subscribed. Thank you!'
          : "Thanks for subscribing! We'll email you when we publish new news or programmes.",
      });
      setEmail('');
    } catch (err) {
      const msg = err instanceof Error && /valid email/i.test(err.message)
        ? 'Please enter a valid email address.'
        : 'An error occurred. Please try again later.';
      setStatus({ type: 'error', text: msg });
      toast({ title: 'Subscription Failed', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('w-full', className)}>
    <form
      className={cn('flex w-full gap-2', layout === 'inline' ? 'flex-col sm:flex-row' : 'flex-col')}
      onSubmit={handleSubmit}
    >
      <label htmlFor={id} className="sr-only">Email address</label>
      <Input
        id={id}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status) setStatus(null); }}
        placeholder="Enter your email"
        disabled={isLoading}
        className="bg-background"
      />
      <Button type="submit" disabled={isLoading} className="shrink-0">
        {isLoading ? 'Subscribing…' : 'Subscribe'}
      </Button>
    </form>
    {status && (
      <p
        role={status.type === 'error' ? 'alert' : 'status'}
        aria-live="polite"
        className={cn('mt-2 text-sm font-medium', status.type === 'success' ? 'text-green-600' : 'text-red-600')}
      >
        {status.text}
      </p>
    )}
    </div>
  );
}
