import React from "react";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf8]">
      <NavBar />
      <main className="flex-1 w-full mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
