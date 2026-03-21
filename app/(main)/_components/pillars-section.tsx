"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryStyle } from "@/lib/service-category-styles";
import type { Doc } from "@/convex/_generated/dataModel";

function taglineFromService(s: Doc<"services">): string {
  if (s.features && s.features.length > 0) {
    return s.features
      .map((f) => f.title)
      .filter(Boolean)
      .slice(0, 5)
      .join(" · ");
  }
  if (s.tags && s.tags.length > 0) {
    return s.tags.slice(0, 5).join(" · ");
  }
  return s.shortTitle || s.category || "";
}

export default function PillarsSection() {
  const spotlight = useQuery(api.services.getSpotlightServices);
  const loading = spotlight === undefined;

  return (
    <section className="bg-secondary" aria-labelledby="pillars-heading">
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            What We Do
          </Badge>
          <h2
            id="pillars-heading"
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
          >
            Our Focus Areas & Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Spotlight programs you can explore in full detail. Manage these cards from the dashboard
            by marking services as &quot;Show on home &amp; about&quot; or featuring them.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : !spotlight || spotlight.length === 0 ? (
          <div className="text-center py-12 mb-10 rounded-2xl border border-dashed bg-background">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground max-w-md mx-auto">
              No spotlight services yet. Publish services in the dashboard and enable{" "}
              <strong>Show on home &amp; about</strong>, or mark them as <strong>Featured</strong>.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/services">Browse all services</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {spotlight.map((service, index) => {
              const style = getCategoryStyle(service.category);
              const Icon = style.icon;
              const tagline = taglineFromService(service);
              return (
                <Link
                  key={service._id}
                  href={`/services/${service._id}`}
                  className="group block"
                >
                  <div
                    className={`rounded-2xl p-6 border ${style.lightColor} ${style.borderColor} hover:shadow-lg transition-all duration-300 h-full`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 ${style.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold ${style.textColor} opacity-60`}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {service.category && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${style.textColor} border-current`}
                            >
                              {service.category}
                            </Badge>
                          )}
                          {service.shortTitle && !service.category && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${style.textColor} border-current`}
                            >
                              {service.shortTitle}
                            </Badge>
                          )}
                        </div>
                        <h3
                          className={`text-xl font-bold mb-1 ${style.textColor} group-hover:underline`}
                        >
                          {service.title}
                        </h3>
                        {tagline ? (
                          <p className="text-xs text-muted-foreground mb-3 italic line-clamp-2">
                            {tagline}
                          </p>
                        ) : null}
                        <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-4 text-sm font-medium ${style.textColor}`}
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="default">
            <Link href="/services">
              All services <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Our full mission &amp; story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
