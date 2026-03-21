"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function uniqueCategories(services: { category?: string }[]): string[] {
  return Array.from(
    new Set(services.map((s) => s.category).filter((c): c is string => !!c?.trim())),
  );
}

/** Hero paragraph — reflects live published service areas */
export function AboutHeroDynamicLead() {
  const spotlight = useQuery(api.services.getSpotlightServices);

  if (spotlight === undefined) {
    return (
      <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        Boost Health Initiative (BHI) is a Uganda-based nonprofit improving health outcomes for
        young people and communities in Kayunga and surrounding districts.
      </p>
    );
  }

  if (!spotlight.length) {
    return (
      <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        Boost Health Initiative (BHI) is a Uganda-based nonprofit improving health outcomes for young
        people and communities in Kayunga and surrounding districts — through clinical care, outreach,
        and partnerships. Explore our{" "}
        <Link href="/services" className="text-primary font-medium underline-offset-4 hover:underline">
          full list of services
        </Link>{" "}
        to see how we work.
      </p>
    );
  }

  const categories = uniqueCategories(spotlight);
  const categoryPhrase =
    categories.length > 0 ? categories.join(", ") : "community health and youth support";

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <p className="text-xl text-muted-foreground leading-relaxed">
        {spotlight.length === 1 ? (
          <>
            Our current priority work focuses on{" "}
            <span className="text-foreground font-semibold">{spotlight[0].title}</span>
            {" — "}read the full story in the section below, or{" "}
            <Link href="/services" className="text-primary font-medium underline-offset-4 hover:underline">
              browse all services
            </Link>
            .
          </>
        ) : (
          <>
            Our work spans{" "}
            <span className="text-foreground font-semibold">{categoryPhrase}</span>
            {" — "}each area detailed in the sections below.
          </>
        )}
      </p>
      <p className="text-base text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground">Explore: </span>
        {spotlight.map((s, i) => (
          <span key={s._id}>
            {i > 0 ? " · " : null}
            <Link
              href={`/services/${s._id}`}
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              {s.title}
            </Link>
          </span>
        ))}
        {" · "}
        <Link href="/services" className="text-primary font-medium underline-offset-4 hover:underline">
          All services
        </Link>
      </p>
    </div>
  );
}

/** Mission card body — reflects active service categories */
export function AboutMissionDynamicLine() {
  const spotlight = useQuery(api.services.getSpotlightServices);

  if (spotlight === undefined || !spotlight.length) {
    return (
      <p className="text-muted-foreground leading-relaxed">
        To improve youth health outcomes and empower communities through evidence-based interventions
        across sexual and reproductive health, non-communicable disease care, gender-based violence
        response, substance use recovery, and wider primary health — delivered with dignity and
        rooted in community evidence.
      </p>
    );
  }

  const categories = uniqueCategories(spotlight);
  return (
    <p className="text-muted-foreground leading-relaxed">
      To improve youth health outcomes and empower communities through evidence-based interventions —
      including{" "}
      <span className="text-foreground font-medium">
        {categories.length ? categories.join(", ") : "our active health programs"}
      </span>{" "}
      — alongside clinical outreach, referrals, and local capacity building across Kayunga and
      partner districts.
    </p>
  );
}
