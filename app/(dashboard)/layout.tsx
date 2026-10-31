import React from "react";
import type { Metadata } from "next";
import DashboardHeader from '../../components/dashboard/header';
import DashboardSidebar from '../../components/dashboard/sidebar';
import DashboardFooter from '../../components/dashboard/footer';
import DashboardAccessGate from '../../components/dashboard/access-gate';

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <DashboardAccessGate>{children}</DashboardAccessGate>
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
