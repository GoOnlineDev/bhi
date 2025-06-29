"use client";

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import BHIUserButton from './user-button';

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fcfaf8]/95 backdrop-blur-sm border-b border-[#e6e2dc]">
        <div className="flex items-center justify-between px-4 md:px-10 py-3">
          {/* Mobile Nav - Logo + Hamburger */}
          <div className="flex items-center md:hidden w-full justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-[#1c140d] text-lg font-bold">Boost Health Initiative</span>
            </Link>
            <button
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation"
              className="flex flex-col gap-1 p-2 z-50 relative"
            >
              <span className={`w-6 h-0.5 bg-[#1c140d] rounded transition-all duration-300 ${navOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#1c140d] rounded transition-all duration-300 ${navOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#1c140d] rounded transition-all duration-300 ${navOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>

          {/* Desktop Nav - Logo + Title */}
          <Link href="/" className="hidden md:flex items-center gap-4">
            <div className="relative w-10 h-10">
              <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" fill className="object-contain" />
            </div>
            <h1 className="text-[#1c140d] text-xl font-bold">Boost Health Initiative</h1>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[#1c140d] font-medium text-sm">
            <Link href="/" className="hover:text-[#f37c1b] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#f37c1b] transition-colors">About</Link>
            <Link href="/services" className="hover:text-[#f37c1b] transition-colors">Services</Link>
            <Link href="/programs" className="hover:text-[#f37c1b] transition-colors">Programs</Link>
            <Link href="/gallery" className="hover:text-[#f37c1b] transition-colors">Gallery</Link>
            <Link href="/news" className="hover:text-[#f37c1b] transition-colors">News</Link>
            <Link href="/contact" className="hover:text-[#f37c1b] transition-colors">Contact</Link>
            
            {/* Authentication Section */}
            <div className="ml-4 flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="px-4 py-2 rounded-lg bg-[#f37c1b] text-white font-semibold hover:bg-orange-500 transition-all">
                    Become a Member
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <BHIUserButton />
              </SignedIn>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" fill className="object-contain" />
                </div>
                <span className="text-[#1c140d] font-bold text-lg">BHI</span>
              </div>
              <button
                onClick={() => setNavOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
              {/* User Section */}
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <button
                      onClick={() => setNavOpen(false)}
                      className="w-full py-3 px-4 bg-[#f37c1b] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Become a Member
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <BHIUserButton isMobile={true} onMobileMenuClose={() => setNavOpen(false)} />
                </SignedIn>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-4">
                  <Link
                    href="/"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f37c1b]/10 hover:text-[#f37c1b] rounded-lg transition-colors"
                  >
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f37c1b]/10 hover:text-[#f37c1b] rounded-lg transition-colors"
                  >
                    <span className="font-medium">About</span>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f37c1b]/10 hover:text-[#f37c1b] rounded-lg transition-colors"
                  >
                    <span className="font-medium">Services</span>
                  </Link>
                  <Link
                    href="/programs"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f37c1b]/10 hover:text-[#f37c1b] rounded-lg transition-colors"
                  >
                    <span className="font-medium">Programs</span>
                  </Link>
                  <Link
                    href="/gallery"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f37c1b]/10 hover:text-[#f37c1b] rounded-lg transition-colors"
                  >
                    <span className="font-medium">Gallery</span>
                  </Link>
                  <Link
                    href="/news"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f37c1b]/10 hover:text-[#f37c1b] rounded-lg transition-colors"
                  >
                    <span className="font-medium">News</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setNavOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f37c1b]/10 hover:text-[#f37c1b] rounded-lg transition-colors"
                  >
                    <span className="font-medium">Contact</span>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}