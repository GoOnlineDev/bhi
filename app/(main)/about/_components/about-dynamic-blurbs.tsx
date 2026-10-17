"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FOCUS_AREAS, focusAreaHref } from "@/lib/site-content";

const linkClass = "text-primary font-medium underline-offset-4 hover:underline";

/** Hero lead listing the core focus areas; links go to a matching published service or /services. */
export function AboutHeroFocusAreas() {
  const services = useQuery(api.services.getPublishedServices);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
        Our work spans{" "}
        <span className="text-foreground font-semibold">
          {FOCUS_AREAS.map((a) => a.short).join(", ")}
        </span>
        {" "}and beyond, rooted in Kayunga District and its surrounding communities.
      </p>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground">Explore: </span>
        {FOCUS_AREAS.map((a, i) => (
          <span key={a.short}>
            {i > 0 ? " · " : null}
            <Link href={focusAreaHref(a, services)} className={linkClass}>
              {a.name}
            </Link>
          </span>
        ))}
        {" · "}
        <Link href="/services" className={linkClass}>
          All services
        </Link>
      </p>
    </div>
  );
}
