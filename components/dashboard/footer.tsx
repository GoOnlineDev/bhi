import React from "react";

export default function DashboardFooter() {
  return (
    <footer className="w-full border-t bg-background px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Boost Health Initiative</span>
        <span className="hidden md:inline-block">Content &amp; user management</span>
      </div>
    </footer>
  );
}
