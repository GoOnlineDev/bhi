import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Boost Health Initiative. Location: Level 1 Ssebowa House, Plot 1 Ssekajja Road, Kayunga Central. Phone: +256-772-670-744, +256-700-304-407. Email: bhi@boosthealthinitiative.org. Hours: Open 24/7, All Days.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}