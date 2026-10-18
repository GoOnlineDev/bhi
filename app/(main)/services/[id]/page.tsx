"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ServiceDetailSkeleton, ServiceDetailView } from "@/components/services/service-detail-view";
import { allServiceLinks, getCoreProgram, type CoreProgram, type ServiceLink } from "@/lib/core-programs";

// Same category first, then the rest, excluding the current page.
function relatedLinks(links: ServiceLink[], currentKey: string, category?: string): ServiceLink[] {
  return links
    .filter((l) => l.key !== currentKey)
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, 3);
}

function ConvexServiceDetail({ id }: { id: string }) {
  const service = useQuery(api.services.getServiceById, { id: id as Id<"services"> });
  const allServices = useQuery(api.services.getPublishedServices);
  if (service === undefined) return <ServiceDetailSkeleton />;
  if (!service) notFound();
  return <ServiceDetailView service={service} related={relatedLinks(allServiceLinks(allServices), service._id, service.category)} />;
}

function CoreProgramDetail({ program }: { program: CoreProgram }) {
  const allServices = useQuery(api.services.getPublishedServices);
  return <ServiceDetailView service={program} related={relatedLinks(allServiceLinks(allServices), program.slug, program.category)} />;
}

export default function ServiceDetailPage() {
  const id = useParams().id as string;
  const program = getCoreProgram(id);
  return program ? <CoreProgramDetail program={program} /> : <ConvexServiceDetail id={id} />;
}
