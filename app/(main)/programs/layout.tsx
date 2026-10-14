import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Community health programmes run by Boost Health Initiative in Kayunga, Uganda.",
  alternates: { canonical: "/programs" },
  openGraph: { url: "/programs" },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 