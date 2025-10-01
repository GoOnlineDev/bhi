import React from "react";

export default function DashboardFooter() {
  return (
    <footer className="w-full bg-background border-t py-4 px-4 md:px-8">
      <div className="flex items-center justify-between text-sm text-muted-foreground max-w-7xl mx-auto">
        <span>&copy; {new Date().getFullYear()} Boost Health Initiative</span>
        <span className="hidden md:inline-block">Empowering Communities Through Health</span>
      </div>
    </footer>
  );
}
