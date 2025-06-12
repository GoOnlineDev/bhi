'use client';

import { useState } from 'react';

export default function DonateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitted) return;
    try {
      const res = await fetch('/api/send-email/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('There was an error sending your donation. Please try again.');
      }
    } catch (err) {
      alert('There was an error sending your donation. Please try again.');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 overflow-y-auto max-h-[90vh] font-['Lexend','Noto Sans',sans-serif']">
        <button
          className="absolute top-4 right-4 text-2xl text-[#1c140d] hover:text-orange-500 focus:outline-none"
          onClick={onClose}
          aria-label="Close donate modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#1c140d]">Donate to Boost Health Initiative</h2>
        {submitted ? (
          <div className="text-emerald-600 font-semibold text-lg py-8 text-center">Thank you for your generous donation!</div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-medium">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-[#1c140d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-[#1c140d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="font-medium">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-[#1c140d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="font-medium">Amount (UGX)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="1000"
                className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-[#1c140d]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-medium">Message (optional)</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-[#1c140d] resize-none"
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-[#f37c1b] hover:bg-orange-500 text-[#1c140d] font-bold rounded-lg px-6 py-3 text-lg shadow-lg transition-all"
            >
              Donate
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 