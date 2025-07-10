'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import BHIUserButton from "../user-button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { navLinks } from "./sidebar";

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Logo" width={32} height={32} />
              <span>BHI Dashboard</span>
            </Link>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  { "bg-muted text-foreground": pathname === href }
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {/* Can add a search bar here later */}
      </div>
      
      <div className="flex items-center gap-2">
        <SignedIn>
          <BHIUserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
