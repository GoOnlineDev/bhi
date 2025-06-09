"use client";

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import DonateModal from './DonateModal';

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  return (
    <>
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fcfaf8]/70 backdrop-blur-md border-b border-[#f4ede7] flex items-center justify-between px-4 md:px-10 py-3">
        {/* Mobile Nav: Hamburger + Centered Text + Logo */}
        <div className="flex items-center w-full md:hidden justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Boost Health Initiative Logo" fill className="object-contain" />
            </div>
            <button
              className="flex flex-col justify-center items-center w-8 h-8 p-0 ml-1"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Open navigation menu"
            >
              <span className="block w-6 h-0.5 bg-[#1c140d] mb-1 rounded"></span>
              <span className="block w-6 h-0.5 bg-[#1c140d] mb-1 rounded"></span>
              <span className="block w-6 h-0.5 bg-[#1c140d] rounded"></span>
            </button>
          </div>
          <span className="flex-1 text-center text-[#1c140d] text-xl font-bold">Boost Health Initiative
          </span>
          <span className="w-8"></span> {/* Spacer to balance layout */}
        </div>
        {/* Desktop Nav: Logo + Title + Links */}
        <div className="hidden md:flex items-center gap-4 text-[#1c140d]">
          <div className="relative w-18 h-18 md:w-16 md:h-16">
            <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Boost Health Initiative Logo" fill className="object-contain" />
          </div>
          <h2 className="text-[#1c140d] text-lg font-bold leading-tight tracking-[-0.015em] whitespace-nowrap">Boost Health Initiative</h2>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link className="text-[#1c140d] text-sm font-medium" href="/">Home</Link>
            <Link className="text-[#1c140d] text-sm font-medium" href="/about">About</Link>
            <Link className="text-[#1c140d] text-sm font-medium" href="/programs">Programs</Link>
            <Link className="text-[#1c140d] text-sm font-medium" href="/news">News</Link>
            <Link className="text-[#1c140d] text-sm font-medium" href="/contact">Contact</Link>
          </div>
          <button
            onClick={() => setDonateOpen(true)}
            className="ml-8 flex min-w-[84px] h-10 px-4 items-center justify-center rounded-lg bg-[#f37c1b] text-[#1c140d] text-sm font-bold tracking-[0.015em] hover:bg-orange-500 transition-all"
          >
            <span className="truncate">Donate</span>
          </button>
        </nav>
        {/* Mobile Nav Drawer */}
        {navOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex" onClick={() => setNavOpen(false)}>
            <nav
              className="bg-white/95 w-4/5 max-w-xs h-full shadow-2xl flex flex-col gap-6 p-6 animate-mobile-slide-in relative transition-transform duration-300"
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 text-3xl text-[#1c140d]" onClick={() => setNavOpen(false)} aria-label="Close navigation menu">
                &times;
              </button>
              <div className="flex flex-col gap-6 mt-10">
                <Link className="text-[#1c140d] text-lg font-semibold py-2" href="/" onClick={() => setNavOpen(false)}>Home</Link>
                <Link className="text-[#1c140d] text-lg font-semibold py-2" href="/about" onClick={() => setNavOpen(false)}>About</Link>
                <Link className="text-[#1c140d] text-lg font-semibold py-2" href="/programs" onClick={() => setNavOpen(false)}>Programs</Link>
                <Link className="text-[#1c140d] text-lg font-semibold py-2" href="/news" onClick={() => setNavOpen(false)}>News</Link>
                <Link className="text-[#1c140d] text-lg font-semibold py-2" href="/contact" onClick={() => setNavOpen(false)}>Contact</Link>
                <button
                  onClick={() => { setDonateOpen(true); setNavOpen(false); }}
                  className="mt-4 flex min-w-[84px] h-10 px-4 items-center justify-center rounded-lg bg-[#f37c1b] text-[#1c140d] text-base font-bold tracking-[0.015em] hover:bg-orange-500 transition-all"
                >
                  <span className="truncate">Donate</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
} 