import React from "react";
import DashboardHeader from '../../components/dashboard/header';
import DashboardSidebar from '../../components/dashboard/sidebar';
import DashboardFooter from '../../components/dashboard/footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col sm:pl-14">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
