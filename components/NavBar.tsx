"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import BHIUserButton from './user-button';
import { X, Menu, ChevronDown, ArrowRight, CalendarDays, Newspaper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FOCUS_AREAS, focusAreaHref } from '@/lib/site-content';
import { getCategoryStyle } from '@/lib/service-category-styles';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

type MenuItem = {
  key: string;
  href: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName: string;
  titleClassName?: string;
};

type NavMenu = {
  /** `undefined` while loading. */
  items: MenuItem[] | undefined;
  viewAllLabel: string;
  emptyText: string;
  wide?: boolean;
};

type NavEntry = { href: string; label: string; menu?: NavMenu };

const MENU_LIMIT = 5;

const PROGRAM_STATUS_COLOR: Record<string, string> = {
  upcoming: 'bg-blue-500',
  ongoing: 'bg-emerald-500',
  completed: 'bg-slate-500',
};

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function MenuItemContent({ item, compact }: { item: MenuItem; compact?: boolean }) {
  const Icon = item.icon;
  return (
    <>
      <span className={cn('flex flex-shrink-0 items-center justify-center text-white', compact ? 'h-7 w-7 rounded-md' : 'h-9 w-9 rounded-lg', item.iconClassName)}>
        <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className={cn('block text-sm font-semibold leading-snug line-clamp-2', item.titleClassName ?? 'text-foreground')}>{item.title}</span>
        {item.subtitle && <span className="block text-xs leading-snug text-muted-foreground line-clamp-2">{item.subtitle}</span>}
      </span>
    </>
  );
}

function MenuStatus({ menu }: { menu: NavMenu }) {
  if (menu.items === undefined) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
      </div>
    );
  }
  return <p className="px-3 py-4 text-sm text-muted-foreground">{menu.emptyText}</p>;
}

function DesktopDropdown({ entry, menu }: { entry: NavEntry; menu: NavMenu }) {
  const hasItems = !!menu.items?.length;
  return (
    <NavigationMenu viewportWrapperClassName="left-1/2 -translate-x-1/2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-auto bg-transparent p-0 font-medium hover:bg-transparent hover:text-primary focus:bg-transparent focus-visible:text-primary data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
            {entry.label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className={cn('p-3', menu.wide ? 'w-[560px]' : 'w-[380px]')}>
              {hasItems ? (
                <ul className={cn('grid gap-1', menu.wide && 'grid-cols-2')}>
                  {menu.items!.map((item) => (
                    <li key={item.key}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-secondary focus:bg-secondary focus:outline-none"
                        >
                          <MenuItemContent item={item} />
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <MenuStatus menu={menu} />
              )}
              <NavigationMenuLink asChild>
                <Link
                  href={entry.href}
                  className="mt-2 flex items-center justify-between border-t px-3 pt-3 pb-1 text-sm font-semibold text-primary hover:underline"
                >
                  {menu.viewAllLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileDropdown({
  entry,
  menu,
  open,
  onToggle,
  onNavigate,
}: {
  entry: NavEntry;
  menu: NavMenu;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const panelId = `mobile-menu-${entry.href.slice(1)}`;
  const tabIndex = open ? undefined : -1;
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'flex w-full items-center justify-between px-4 py-3 rounded-lg transition-colors text-lg hover:bg-primary/10 hover:text-primary',
          open ? 'text-primary' : 'text-foreground'
        )}
      >
        {entry.label}
        <ChevronDown className={cn('h-5 w-5 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      <div
        id={panelId}
        aria-hidden={!open}
        className={cn('grid transition-all duration-300 ease-in-out', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
      >
        <div className="overflow-hidden">
          <div className="ml-4 border-l pl-2 py-1">
            {menu.items?.length ? (
              <ul className="space-y-1">
                {menu.items.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      tabIndex={tabIndex}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-secondary"
                    >
                      <MenuItemContent item={item} compact />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <MenuStatus menu={menu} />
            )}
            <Link
              href={entry.href}
              onClick={onNavigate}
              tabIndex={tabIndex}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:underline"
            >
              {menu.viewAllLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const services = useQuery(api.services.getPublishedServices);
  const programs = useQuery(api.programs.getApprovedPrograms);
  const news = useQuery(api.news.getPublishedNews);

  const navLinks: NavEntry[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    {
      href: '/services',
      label: 'What We Do',
      menu: {
        wide: true,
        viewAllLabel: 'See everything we do',
        emptyText: '',
        items: FOCUS_AREAS.map((area) => {
          const style = getCategoryStyle(area.styleKey);
          return {
            key: area.short,
            href: focusAreaHref(area, services),
            title: area.short,
            subtitle: area.name,
            icon: area.icon,
            iconClassName: style.color,
            titleClassName: style.textColor,
          };
        }),
      },
    },
    {
      href: '/programs',
      label: 'Programs',
      menu: {
        viewAllLabel: 'View all programs',
        emptyText: 'No programs published yet.',
        items: programs?.slice(0, MENU_LIMIT).map((p) => ({
          key: p._id,
          href: `/programs/${p._id}`,
          title: p.name,
          subtitle: [capitalize(p.status), formatDate(p.startDate), p.location].filter(Boolean).join(' · '),
          icon: CalendarDays,
          iconClassName: PROGRAM_STATUS_COLOR[p.status.toLowerCase()] ?? 'bg-primary',
        })),
      },
    },
    { href: '/gallery', label: 'Gallery' },
    {
      href: '/news',
      label: 'News',
      menu: {
        viewAllLabel: 'View all news',
        emptyText: 'No news published yet.',
        items: news?.slice(0, MENU_LIMIT).map((n) => ({
          key: n._id,
          href: `/news/${n._id}`,
          title: n.title,
          subtitle: `${n.category} · ${formatDate(n.startDate)}`,
          icon: Newspaper,
          iconClassName: 'bg-primary',
        })),
      },
    },
    { href: '/contact', label: 'Contact' },
  ];

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
        <div className="flex items-center justify-between h-16 px-4 md:px-10 max-w-7xl mx-auto gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
              <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Boost Health Initiative Logo" fill className="object-contain" />
            </div>
            <span className="text-foreground text-base sm:text-lg md:text-xl font-bold leading-tight truncate">Boost Health Initiative</span>
          </Link>
          
          {/* Mobile Nav - Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              className="p-2 -mr-2"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-foreground font-medium text-sm">
            {navLinks.map((entry) =>
              entry.menu ? (
                <DesktopDropdown key={entry.href} entry={entry} menu={entry.menu} />
              ) : (
                <Link key={entry.href} href={entry.href} className="hover:text-primary transition-colors">{entry.label}</Link>
              )
            )}
            
            {/* Authentication Section */}
            <div className="ml-4 flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button
                    title="Staff and editor sign in"
                    className="px-4 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Sign in
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
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
            <div className="flex flex-col h-[calc(100%-65px)]">
              {/* User Section */}
              <div className="p-4 bg-secondary/50 border-b">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <button
                      onClick={() => setNavOpen(false)}
                      className="w-full py-3 px-4 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-center"
                    >
                      Sign in (staff)
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
                  {navLinks.map((entry) => entry.menu ? (
                    <MobileDropdown
                      key={entry.href}
                      entry={entry}
                      menu={entry.menu}
                      open={openSection === entry.href}
                      onToggle={() => setOpenSection((s) => (s === entry.href ? null : entry.href))}
                      onNavigate={() => setNavOpen(false)}
                    />
                  ) : (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      onClick={() => setNavOpen(false)}
                      className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-lg"
                    >
                      {entry.label}
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