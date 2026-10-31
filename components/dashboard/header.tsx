'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import BHIUserButton from "../user-button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SidebarNav, isActiveLink, navLinks } from "./sidebar";

export default function DashboardHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = navLinks.find((l) => isActiveLink(pathname, l.href));

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 lg:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">Dashboard</p>
        <p className="truncate text-base font-semibold text-foreground sm:text-lg">{current?.label ?? "Dashboard"}</p>
      </div>

      <SignedIn>
        <BHIUserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
    </header>
  );
}
