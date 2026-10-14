import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const canonical = `/programs/${params.id}`;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  try {
    if (url) {
      const client = new ConvexHttpClient(url);
      const item: any = await client.query(api.programs.getProgramById, { id: params.id as Id<any> });
      if (item) {
        const description = String(item.description ?? "").slice(0, 160);
        const image = item.images?.[0] ?? item.image ?? item.imageUrl;
        return {
          title: item.name,
          description,
          alternates: { canonical },
          openGraph: { type: "article", url: canonical, title: item.name, description, ...(image ? { images: [image] } : {}) },
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
