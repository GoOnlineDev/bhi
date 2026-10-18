import type { MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { SITE_URL } from "@/lib/site";
import { CORE_PROGRAMS, unclaimedCorePrograms } from "@/lib/core-programs";

// Rebuild the sitemap at most hourly so new news/programmes/services appear.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = ["", "/about", "/services", "/programs", "/news", "/gallery", "/contact"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" || p === "/news" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  const coreEntry = (slug: string) => ({ url: `${SITE_URL}/services/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 });

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return [...entries, ...CORE_PROGRAMS.map((p) => coreEntry(p.slug))];

  try {
    const client = new ConvexHttpClient(convexUrl);
    const [news, programs, services] = await Promise.all([
      client.query(api.news.getPublishedNews, {}),
      client.query(api.programs.getApprovedPrograms, {}),
      client.query(api.services.getPublishedServices, {}),
    ]);
    for (const n of news) {
      entries.push({ url: `${SITE_URL}/news/${n._id}`, lastModified: new Date(n.updatedAt ?? n.publishedAt), changeFrequency: "monthly", priority: 0.6 });
    }
    for (const p of programs) {
      entries.push({ url: `${SITE_URL}/programs/${p._id}`, lastModified: new Date(p.updatedAt ?? p.createdAt), changeFrequency: "monthly", priority: 0.7 });
    }
    for (const s of services as any[]) {
      entries.push({ url: `${SITE_URL}/services/${s._id}`, lastModified: new Date(s.updatedAt ?? s._creationTime), changeFrequency: "monthly", priority: 0.7 });
    }
    // Built-in programme pages redirect once an admin service covers them, so list only the unclaimed ones.
    for (const p of unclaimedCorePrograms(services as any[])) entries.push(coreEntry(p.slug));
  } catch (err) {
    console.error("sitemap: failed to load dynamic entries", err);
    entries.push(...CORE_PROGRAMS.map((p) => coreEntry(p.slug)));
  }
  return entries;
}
