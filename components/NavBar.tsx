"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import BHIUserButton from './user-button';
import { X, Menu } from 'lucide-react';

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [navOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 md:px-10 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-10 h-10">
              <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Boost Health Initiative Logo" fill className="object-contain" />
            </div>
            <span className="text-foreground text-lg md:text-xl font-bold">Boost Health Initiative</span>
          </Link>
          
          {/* Mobile Nav - Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              className="p-2"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-foreground font-medium text-sm">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link href="/programs" className="hover:text-primary transition-colors">Programs</Link>
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/news" className="hover:text-primary transition-colors">News</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            
            {/* Authentication Section */}
            <div className="ml-4 flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
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
      <div 
        className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!navOpen}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60"
          onClick={() => setNavOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div 
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl transform transition-transform duration-300 ease-in-out ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span id="mobile-menu-title" className="text-foreground font-bold text-lg">Menu</span>
              <button
                onClick={() => setNavOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
              {/* User Section */}
              <div className="p-4 bg-secondary/50 border-b">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <button
                      onClick={() => setNavOpen(false)}
                      className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center"
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
                <nav className="flex flex-col space-y-1 px-4">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/about", label: "About" },
                    { href: "/services", label: "Services" },
                    { href: "/programs", label: "Programs" },
                    { href: "/gallery", label: "Gallery" },
                    { href: "/news", label: "News" },
                    { href: "/contact", label: "Contact" },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setNavOpen(false)}
                      className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-lg"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}