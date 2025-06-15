import React from "react";
import DashboardHeader from '../../components/dashboard/header';
import DashboardSidebar from '../../components/dashboard/sidebar';
import DashboardFooter from '../../components/dashboard/footer';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf8]">
      <DashboardHeader />
      <div className="flex flex-1 w-full">
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 w-full md:ml-64 p-4 md:p-8">
          {children}
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}
