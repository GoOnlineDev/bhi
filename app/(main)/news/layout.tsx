import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest news, health tips and announcements from Boost Health Initiative and Suubi Medical Centre.",
  alternates: { canonical: "/news" },
  openGraph: { url: "/news" },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 