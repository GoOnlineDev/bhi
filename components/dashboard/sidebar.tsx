'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Newspaper,
  HeartPulse,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

export const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/news", label: "News", icon: Newspaper },
  { href: "/dashboard/programs", label: "Programs", icon: HeartPulse },
  { href: "/dashboard/gallery", label: "Gallery", icon: ImageIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-56 flex-col border-r bg-background sm:flex">
              {/* Centered Logo */}
         <div className="flex flex-col items-center mb-2 mt-3">
          <Link
            href="/"
            className="group flex flex-col items-center gap-2"
          >
            <Image 
              src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" 
              alt="BHI Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="font-bold text-lg text-primary-foreground">BHI</span>
          </Link>
        </div>
      <nav className="flex flex-col items-stretch gap-2 px-4 py-6 h-full">
        {/* Navigation Links */}
        <div className="flex flex-col gap-2 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent",
                { "bg-accent text-accent-foreground": pathname === href }
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

      </nav>
    </aside>
  );
}
