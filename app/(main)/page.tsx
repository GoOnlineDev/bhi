
import Hero from "./_components/hero";
import MissionSection from "./_components/mission-section";
import LatestUpdates from "./_components/latest-updates";
import IntroSection from "./_components/intro-section";
import ImpactSection from "./_components/impact-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Health Programmes in Kayunga, Uganda",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <div className="flex-1 w-full">
      <Hero />
      <IntroSection />
      <ImpactSection />
      <div className="py-8">
        <LatestUpdates />
      </div>
      <div className="py-8">
        <MissionSection />
      </div>
    </div>
  );
}
