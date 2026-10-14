import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

// Server-side existence check so unknown/unpublished ids return a real 404 status.
export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (url) {
    let item: unknown = undefined;
    try {
      const client: any = new ConvexHttpClient(url);
      item = await client.query(api.services.getServiceById, { id: params.id as Id<any> });
    } catch {
      item = undefined; // Convex unreachable: let the client page handle it
    }
    if (item === null) notFound();
  }
  return <>{children}</>;
}
