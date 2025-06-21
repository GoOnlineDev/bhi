'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#fcfaf8] border-b border-[#f4ede7] flex items-center justify-between px-4 py-3 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" width={36} height={36} className="object-contain" />
        <span className="font-black text-lg md:text-2xl text-[#1c140d] tracking-tight">Boost Health Initiative Dashboard</span>
      </div>

      {/* Mobile menu button */}
      <nav className="md:hidden">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-[#f4ede7] text-[#1c140d] focus:outline-none hover:bg-[#f37c1b] hover:text-white transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg 
            width="24" 
            height="24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`transform transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
          >
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Desktop navigation */}
      <nav className="hidden md:flex gap-6">
        <Link href="/dashboard" className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition">Home</Link>
        <Link href="/dashboard/news" className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition">News</Link>
        <Link href="/dashboard/programs" className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition">Programs</Link>
        <Link href="/dashboard/gallery" className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition">Gallery</Link>
      </nav>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-[#fcfaf8] shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          <Link 
            href="/dashboard" 
            className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition py-2"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link 
            href="/dashboard/news" 
            className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition py-2"
            onClick={closeMobileMenu}
          >
            News
          </Link>
          <Link 
            href="/dashboard/programs" 
            className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition py-2"
            onClick={closeMobileMenu}
          >
            Programs
          </Link>
          <Link 
            href="/dashboard/gallery" 
            className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition py-2"
            onClick={closeMobileMenu}
          >
            Gallery
          </Link>
        </div>
      </div>
    </header>
  );
}
