"use client";

import Link from "next/link";
import SmartImage from "@/components/ui/smart-image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryStyle } from "@/lib/service-category-styles";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

function bulletItems(s: Doc<"services">): string[] {
  if (s.benefits && s.benefits.length > 0) return s.benefits.slice(0, 8);
  if (s.features && s.features.length > 0) {
    return s.features.map((f) => f.title).filter(Boolean).slice(0, 8);
  }
  // Description is already shown above the list, so don't repeat it as a bullet.
  return [];
}

export function AboutFocusAreasSection() {
  const spotlight = useQuery(api.services.getSpotlightServices);
  const loading = spotlight === undefined;

  return (
    <section id="focus-areas" aria-labelledby="focus-areas-heading" className="bg-background">
      <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-6">
            <Layers className="w-4 h-4 mr-2" />
            What We Do
          </Badge>
          <h2
            id="focus-areas-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 break-words"
          >
            Our Focus Areas in Depth
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Our programmes address pressing health challenges facing communities in Kayunga and
            partner districts. Explore our spotlight areas below.
          </p>
        </div>

        {loading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl w-full" />
            ))}
          </div>
        ) : !spotlight || spotlight.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed bg-secondary/30">
            <Layers className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground max-w-lg mx-auto mb-4">
              Our service areas will be displayed here. Browse the full directory below.
            </p>
            <Button asChild variant="outline">
              <Link href="/services">View services</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {spotlight.map((service, index) => {
              const style = getCategoryStyle(service.category);
              const Icon = style.icon;
              const bullets = bulletItems(service);
              const heroImg = service.heroImage || service.images?.[0];
              return (
                <div
                  key={service._id}
                  className={cn(
                    "grid gap-8 items-center rounded-2xl p-4 sm:p-8 border shadow-sm",
                    heroImg ? "md:grid-cols-5" : "",
                    style.lightColor,
                    style.borderColor,
                  )}
                >
                  {heroImg && (
                    <SmartImage
                      src={heroImg}
                      alt={service.title}
                      fit="contain"
                      wrapperClassName={cn(
                        "w-full aspect-[4/3] rounded-xl border md:col-span-2",
                        index % 2 === 1 ? "md:order-last" : "",
                      )}
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  )}
                  <div className={heroImg ? "md:col-span-3" : ""}>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${style.color} text-white text-sm font-semibold mb-4`}
                    >
                      <Icon className="w-4 h-4" />
                      Spotlight {index + 1}
                      {service.category && (
                        <span className="font-normal opacity-90">· {service.category}</span>
                      )}
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${style.textColor}`}>
                      {service.title}
                    </h3>
                    <p className="text-foreground/80 mb-5 leading-relaxed border-l-4 pl-4 border-current">
                      {service.overview || service.description}
                    </p>
                    {bullets.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                        {bullets.map((line, bi) => (
                          <li key={`${service._id}-b-${bi}`} className="flex items-start gap-2">
                            <CheckCircle className={`w-5 h-5 ${style.textColor} flex-shrink-0 mt-0.5`} />
                            <span className="text-foreground text-sm">{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button className={cn(style.color, "text-white hover:opacity-90")} asChild>
                        <Link href={`/services/${service._id}`}>
                          Full service page <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      {service.category && (
                        <Button variant="outline" className="bg-background" asChild>
                          <Link href={`/services?category=${encodeURIComponent(service.category)}`}>
                            More in {service.category}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
