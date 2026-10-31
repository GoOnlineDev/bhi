import { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Do",
  description: "How Boost Health Initiative brings healthcare closer to underserved communities in Kayunga, Uganda: outreach, health education, screening, referral and health systems strengthening.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
