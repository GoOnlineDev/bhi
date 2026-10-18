import React from "react";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Banner from '@/components/banner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-x-hidden">
      <NavBar />
      <main className="flex-1 w-full mx-auto pt-16 min-w-0">
        {children}
      </main>
      <Banner />
      <Footer />
    </div>
  );
}
