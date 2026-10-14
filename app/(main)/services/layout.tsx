import { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Do",
  description: "Health services and initiatives offered by Boost Health Initiative and Suubi Medical Centre.",
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