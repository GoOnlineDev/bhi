import React from "react";
import DashboardHeader from '../../components/dashboard/header';
import DashboardSidebar from '../../components/dashboard/sidebar';
import DashboardFooter from '../../components/dashboard/footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardSidebar />
      <div className="relative flex h-full max-h-screen flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40 overflow-auto">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
