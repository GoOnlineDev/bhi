'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ADMIN_ROLES } from "@/convex/roles";
import { cn } from "@/lib/utils";
import { ROLE_META } from "./role-meta";
import {
  LayoutDashboard,
  Newspaper,
  HeartPulse,
  Image as ImageIcon,
  PanelsTopLeft,
  Layers,
  Users,
  ExternalLink,
} from "lucide-react";

export const navGroups = [
  {
    label: "Overview",
    links: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    links: [
      { href: "/dashboard/hero", label: "Home hero", icon: PanelsTopLeft },
      { href: "/dashboard/news", label: "News", icon: Newspaper },
      { href: "/dashboard/programs", label: "Programs", icon: HeartPulse },
      { href: "/dashboard/services", label: "Services", icon: Layers },
      { href: "/dashboard/gallery", label: "Gallery", icon: ImageIcon },
    ],
  },
  {
    label: "Administration",
    adminOnly: true,
    links: [{ href: "/dashboard/users", label: "Users", icon: Users }],
  },
];

export const navLinks = navGroups.flatMap((g) => g.links);

export const isActiveLink = (pathname: string, href: string) =>
  href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getCurrentUser);
  const isAdmin = !!currentUser && ADMIN_ROLES.includes(currentUser.role);
  const role = currentUser ? ROLE_META[currentUser.role] : null;
  const name = currentUser ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || currentUser.email : "";

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3 px-5 h-16 border-b shrink-0">
        <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="" width={36} height={36} />
        <div className="leading-tight">
          <p className="font-bold text-foreground">Boost Health</p>
          <p className="text-xs text-muted-foreground">Admin dashboard</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6" aria-label="Dashboard">
        {navGroups
          .filter((g) => !g.adminOnly || isAdmin)
          .map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</p>
              <ul className="space-y-1">
                {group.links.map(({ href, label, icon: Icon }) => {
                  const active = isActiveLink(pathname, href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </nav>

      <div className="border-t p-3 space-y-2 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          View website
        </Link>
        {currentUser && role && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
            {currentUser.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUser.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{role.label}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
      <SidebarNav />
    </aside>
  );
}
