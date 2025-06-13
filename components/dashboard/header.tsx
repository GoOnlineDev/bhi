import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardHeader() {
  return (
    <header className="w-full bg-[#fcfaf8] border-b border-[#f4ede7] flex items-center justify-between px-4 py-3 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" width={36} height={36} className="object-contain" />
        <span className="font-black text-lg md:text-2xl text-[#1c140d] tracking-tight">Boost Health Initiative Dashboard</span>
      </div>
      <nav className="md:hidden">
        {/* Mobile menu button placeholder */}
        <button className="p-2 rounded-md bg-[#f4ede7] text-[#1c140d] focus:outline-none">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
      </nav>
      <nav className="hidden md:flex gap-6">
        <Link href="/dashboard" className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition">Home</Link>
        <Link href="/dashboard/profile" className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition">Profile</Link>
        <Link href="/dashboard/settings" className="text-[#1c140d] font-semibold hover:text-[#f37c1b] transition">Settings</Link>
      </nav>
    </header>
  );
}
