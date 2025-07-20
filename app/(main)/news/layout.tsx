import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 