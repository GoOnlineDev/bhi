import React from "react";
import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="bg-[#fcfaf8] border-r border-[#f4ede7] w-full md:w-64 min-h-screen flex flex-row md:flex-col md:fixed md:top-0 md:left-0 z-20">
      <nav className="flex flex-1 flex-row md:flex-col gap-2 md:gap-4 p-2 md:p-6 w-full">
        <Link href="/dashboard" className="w-full px-4 py-2 rounded-lg text-[#1c140d] font-semibold hover:bg-[#f4ede7] transition">Dashboard Home</Link>
        <Link href="/dashboard/news" className="w-full px-4 py-2 rounded-lg text-[#1c140d] font-semibold hover:bg-[#f4ede7] transition">News</Link>
        <Link href="/dashboard/programs" className="w-full px-4 py-2 rounded-lg text-[#1c140d] font-semibold hover:bg-[#f4ede7] transition">Programs</Link>
        <Link href="/dashboard/settings" className="w-full px-4 py-2 rounded-lg text-[#1c140d] font-semibold hover:bg-[#f4ede7] transition">Settings</Link>
      </nav>
    </aside>
  );
}
