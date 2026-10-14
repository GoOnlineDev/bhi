'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';

const STORAGE_KEY = 'bhi-suubi-banner-dismissed';

/** Slim, dismissible strip promoting Suubi Medical Centre. Dismissal is remembered. */
export default function Banner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(localStorage.getItem(STORAGE_KEY) !== '1');
    } catch {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const dismiss = () => {
    setIsVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  };

  return (
    <aside aria-label="Suubi Medical Centre" className="border-t border-primary/20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 text-sm text-foreground">
        <p className="text-center">
          Need clinical care? Our partner{' '}
          <Link
            href="https://suubi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-2 hover:underline inline-flex items-center gap-1"
          >
            Suubi Medical Centre <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </p>
        <button type="button" onClick={dismiss} className="p-1 rounded hover:bg-primary/10" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
