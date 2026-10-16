import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Global 404 for unmatched URLs (e.g. /faq): same header/footer as the public site.
export default function GlobalNotFound() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fcfaf8] overflow-x-hidden w-full">
      <NavBar />
      <main className="flex-1 w-full pt-16">
        <NotFoundContent />
      </main>
      <Footer />
    </div>
  );
}
