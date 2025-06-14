'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import DonateModal from './DonateModal';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [error, setError] = useState("");
  const addSubscriber = useMutation(api.subscribers.addSubscriber);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await addSubscriber({ email });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
    }
  }

  return (
    <footer className="font-['Lexend','Noto Sans',sans-serif] flex flex-col gap-6 px-5 py-10 text-center text-[#1c140d]">
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      {/* Logo */}
      <div className="flex justify-center mb-2">
        <div className="relative w-16 h-16">
          <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Boost Health Initiative Logo" fill className="object-contain" />
        </div>
      </div>
      {/* Social Links */}
      <div className="flex items-center justify-center gap-8 mt-2">
        {/* X (Twitter) */}
        <a
          href="#"
          aria-label="X (Twitter)"
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1c140d] bg-[#fcfaf8] text-[#1c140d] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M4 4l16 16M4 20L20 4" />
          </svg>
        </a>
        {/* Facebook */}
        <a
          href="#"
          aria-label="Facebook"
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1c140d] bg-[#fcfaf8] text-[#1c140d] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M14 8h-2a2 2 0 0 0-2 2v2h4" />
            <path d="M12 16v-4" />
          </svg>
        </a>
        {/* Instagram */}
        <a
          href="#"
          aria-label="Instagram"
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1c140d] bg-[#fcfaf8] text-[#1c140d] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="16.5" cy="7.5" r="1" />
          </svg>
        </a>
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/company/boosthealthinitiative/"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1c140d] bg-[#fcfaf8] text-[#1c140d] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M7 10v7M7 7v.01M12 10v7M12 10c0-1.1.9-2 2-2s2 .9 2 2v7" strokeLinecap="round"/>
          </svg>
        </a>
        {/* WhatsApp */}
        <a
          href="https://wa.me/256727003409"
          target="_blank"
          rel="noopener"
          aria-label="WhatsApp"
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1c140d] bg-[#fcfaf8] text-[#1c140d] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="13" />
            <path d="M11 13c.5 1.5 2.5 4 5 5.5M21 19c-1.5 1-4.5 1-7-2.5" />
            <path d="M16 29c-1.9 0-3.7-.4-5.2-1.2l-5.2 1.7 1.7-5.2C5.4 19.7 5 17.9 5 16c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11z" />
          </svg>
        </a>
      </div>
      {/* Newsletter Subscription */}
      <div className="flex flex-col items-center gap-2 mt-6 w-full">
        <h4 className="text-lg font-semibold mb-1">Subscribe to our Newsletter</h4>
        {subscribed ? (
          <div className="text-emerald-600 font-medium">Thank you for subscribing!</div>
        ) : (
          <form className="flex flex-col sm:flex-row gap-2 w-full max-w-xs justify-center" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-[#1c140d] w-full"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#f37c1b] hover:bg-orange-500 text-[#1c140d] font-bold px-5 py-2 transition-all shadow"
            >
              Subscribe
            </button>
          </form>
        )}
        {error && <div className="text-red-600 font-medium mt-1">{error}</div>}
      </div>
      <p className="text-[#1c140d] text-base font-normal mt-4">© 2025 Boost Health Initiative. All rights reserved.</p>
    </footer>
  );
} 