import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 