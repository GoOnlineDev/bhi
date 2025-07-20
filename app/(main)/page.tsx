
import Hero from "./_components/hero";
import MissionSection from "./_components/mission-section";
import LatestUpdates from "./_components/latest-updates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home ",
};

export default function Home() {
  return (
    <main className="flex-1 w-full">
      <Hero />
      <LatestUpdates />
      <MissionSection />
    </main>
  );
}