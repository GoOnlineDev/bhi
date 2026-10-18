import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { convexOverride, getCoreProgram, type CoreProgram } from "@/lib/core-programs";

function coreProgramMetadata(program: CoreProgram, canonical: string): Metadata {
  return {
    title: program.title,
    description: program.description,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, title: program.title, description: program.description },
  };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const canonical = `/services/${params.id}`;
  const program = getCoreProgram(params.id);
  if (program) return coreProgramMetadata(program, canonical);
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

async function queryConvex<T>(run: (client: any) => Promise<T>): Promise<T | undefined> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return undefined;
  try {
    return await run(new ConvexHttpClient(url));
  } catch {
    return undefined; // Convex unreachable: let the client page handle it
  }
}

// Server-side checks: unknown ids get a real 404; built-in pages hand over to an admin service once one exists.
export default async function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const program = getCoreProgram(params.id);
  if (program) {
    const services = await queryConvex((c) => c.query(api.services.getPublishedServices, {}));
    const override = convexOverride(program, services as any[] | undefined);
    if (override) redirect(`/services/${override._id}`);
    return <>{children}</>;
  }
  const item = await queryConvex((c) => c.query(api.services.getServiceById, { id: params.id as Id<any> }));
  if (item === null) notFound();
  return <>{children}</>;
}
