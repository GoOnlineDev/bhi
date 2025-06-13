import React from "react";

export default function DashboardFooter() {
  return (
    <footer className="w-full bg-[#fcfaf8] border-t border-[#f4ede7] py-4 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-[#1c140d] text-sm font-medium mt-auto">
      <span>&copy; {new Date().getFullYear()} Boost Health Initiative</span>
      <span className="mt-2 md:mt-0">Empowering Communities Through Health</span>
    </footer>
  );
}
