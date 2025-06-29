import React from "react";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Banner from '@/components/banner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fcfaf8] overflow-x-hidden">
      <NavBar />
      <main className="flex-1 w-full mx-auto">
        {children}
      </main>
      <Banner />
      <Footer />
    </div>
  );
}
