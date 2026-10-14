import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const canonical = `/services/${params.id}`;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  try {
    if (url) {
      const client = new ConvexHttpClient(url);
      const item: any = await client.query(api.services.getServiceById, { id: params.id as Id<any> });
      if (item) {
        const description = String(item.description ?? "").slice(0, 160);
        const image = item.heroImage ?? item.images?.[0];
        return {
          title: item.title,
          description,
          alternates: { canonical },
          openGraph: { type: "article", url: canonical, title: item.title, description, ...(image ? { images: [image] } : {}) },
        };
      }
    }
  } catch {
    // invalid id or Convex unreachable: fall through
  }
  return { alternates: { canonical }, robots: { index: false } };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
