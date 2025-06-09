'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you would handle sending the form data to your backend or email service
    setSubmitted(true);
  }

  return (
    <div className="font-['Lexend','Noto Sans',sans-serif]">
      <section className="py-24 text-[#1c140d] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-emerald-500/10 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-orange-500 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Mail className="w-4 h-4 mr-2" />
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
              Contact us to learn more about our programs or explore partnership opportunities.
            </p>
          </div>
          {/* Suubi Medical Centre Button */}
          <div className="flex w-full max-w-[960px] px-4 py-3 justify-start mx-auto">
            <a
              href="https://suubi.com"
              target="_blank"
              rel="noopener"
              className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 bg-[#f4ede7] text-[#1c140d] text-sm font-bold tracking-[0.015em]"
            >
              <span className="relative w-7 h-7 mr-2">
                <img src="/SUUBI LOGO ICON PNG Bckd TRANS.png" alt="Suubi Medical Centre Logo" className="object-contain w-7 h-7" />
              </span>
              <span className="truncate">Visit Suubi Medical Centre</span>
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-[#f4ede7]">
              <h3 className="text-2xl font-bold mb-2">Send Us a Message</h3>
              {submitted ? (
                <div className="text-emerald-600 font-semibold text-lg py-8 text-center">Thank you for reaching out! We'll get back to you soon.</div>
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
                      className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
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
                      className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
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
                      className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="font-medium">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-medium">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="rounded-lg border border-[#f4ede7] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 bg-[#f37c1b] hover:bg-orange-500 text-[#1c140d] font-bold rounded-lg px-6 py-3 text-lg shadow-lg transition-all"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="text-center group bg-white/80 rounded-2xl p-6 shadow-md border border-[#f4ede7]">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <p className="text-slate-700 leading-relaxed">Level 1 Ssebowa House, Plot 1 Ssekajja Road, Kayunga Central</p>
              </div>
              <div className="text-center group bg-white/80 rounded-2xl p-6 shadow-md border border-[#f4ede7]">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Phone</h3>
                <p className="text-slate-700">+256-772-670-744</p>
                <p className="text-slate-700">+256-700-304-407</p>
              </div>
              <div className="text-center group bg-white/80 rounded-2xl p-6 shadow-md border border-[#f4ede7]">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Email</h3>
                <p className="text-slate-700">bhi@boosthealthinitiative.org</p>
              </div>
              <div className="text-center group bg-white/80 rounded-2xl p-6 shadow-md border border-[#f4ede7]">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Hours</h3>
                <p className="text-slate-700">Open 24/7, All Days</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 