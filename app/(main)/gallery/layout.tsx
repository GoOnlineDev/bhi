import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from Boost Health Initiative outreach, programmes and Suubi Medical Centre.",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery" },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 