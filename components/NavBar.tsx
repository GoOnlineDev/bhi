"use client";

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] bg-[#fcfaf8]/80 backdrop-blur-md border-b border-[#e6e2dc]">
        <div className="flex items-center justify-between px-4 md:px-10 py-3">
          {/* Mobile Nav - Logo + Hamburger */}
          <div className="flex items-center md:hidden w-full justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-[#1c140d] text-lg font-bold">Boost Health Initiative</span>
            </div>
            <button
                onClick={() => setNavOpen((v) => !v)}
                aria-label="Toggle navigation"
                className="flex flex-col gap-1 p-2"
              >
                <span className="w-6 h-0.5 bg-[#1c140d] rounded transition-all"></span>
                <span className="w-6 h-0.5 bg-[#1c140d] rounded transition-all"></span>
                <span className="w-6 h-0.5 bg-[#1c140d] rounded transition-all"></span>
              </button>
          </div>

          {/* Desktop Nav - Logo + Title */}
          <Link href="/" >
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-10 h-10">
              <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" fill className="object-contain" />
            </div>
            <h1 className="text-[#1c140d] text-xl font-bold">Boost Health Initiative</h1>
          </div>
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
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#1c140d]">
                    Welcome, {user?.firstName || 'Member'}!
                  </span>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </nav>
        </div>

        {/* Mobile Nav Drawer - Fixed Backdrop */}
        {navOpen && (
          <>
            {/* Full Screen Backdrop - Solid Black */}
            <div 
              className="fixed inset-0 bg-gray-900 z-[200] md:hidden"
              onClick={() => setNavOpen(false)}
              style={{ 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#fcfaf8'
              }}
            />
            
            {/* Mobile Menu */}
            <div className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl z-[300] md:hidden">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="text-xl font-bold text-gray-800">Menu</span>
                  <button
                    onClick={() => setNavOpen(false)}
                    className="text-2xl text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </div>
                
                {/* Navigation Links */}
                <div className="flex-1 py-4">
                  <Link
                    href="/"
                    onClick={() => setNavOpen(false)}
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setNavOpen(false)}
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  >
                    About
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setNavOpen(false)}
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  >
                    Services
                  </Link>
                  <Link
                    href="/programs"
                    onClick={() => setNavOpen(false)}
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  >
                    Programs
                  </Link>
                  <Link
                    href="/gallery"
                    onClick={() => setNavOpen(false)}
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  >
                    Gallery
                  </Link>
                  <Link
                    href="/news"
                    onClick={() => setNavOpen(false)}
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  >
                    News
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setNavOpen(false)}
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  >
                    Contact
                  </Link>
                </div>
                
                {/* Authentication Section */}
                <div className="p-4 border-t">
                  <SignedOut>
                    <SignInButton mode="modal" fallbackRedirectUrl="/">
                      <button
                        onClick={() => setNavOpen(false)}
                        className="w-full py-3 px-4 bg-[#f37c1b] text-white font-semibold rounded-lg hover:bg-orange-600"
                      >
                        Become a Member
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Welcome, {user?.firstName || 'Member'}!
                      </span>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}