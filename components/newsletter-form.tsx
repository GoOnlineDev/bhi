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
  const { toast } = useToast();
  const addSubscriber = useMutation(api.subscribers.addSubscriber);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      const res = await addSubscriber({ email });
      toast({
        title: res.status === 'already_subscribed' ? 'Already subscribed' : 'Subscribed!',
        description: res.status === 'already_subscribed'
          ? 'This email is already on our mailing list.'
          : "Thank you! You'll get an email when we publish new news or programmes.",
      });
      setEmail('');
    } catch (err) {
      const msg = err instanceof Error && err.message.includes('valid email')
        ? 'Please enter a valid email address.'
        : 'An error occurred. Please try again later.';
      toast({ title: 'Subscription Failed', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className={cn('flex w-full gap-2', layout === 'inline' ? 'flex-col sm:flex-row' : 'flex-col', className)}
      onSubmit={handleSubmit}
    >
      <label htmlFor={id} className="sr-only">Email address</label>
      <Input
        id={id}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={isLoading}
        className="bg-background"
      />
      <Button type="submit" disabled={isLoading} className="shrink-0">
        {isLoading ? 'Subscribing…' : 'Subscribe'}
      </Button>
    </form>
  );
}
