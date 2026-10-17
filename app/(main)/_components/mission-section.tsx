"use client";

import SmartImage from "@/components/ui/smart-image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, HandHeart } from "lucide-react";
import { FOCUS_AREAS, MISSION } from "@/lib/site-content";

export default function MissionSection() {
  return (
    <section className="bg-background flex items-center">
      <div className="container mx-auto px-4 py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4 md:order-last">
            <Badge variant="outline" className="self-start">Our Mission</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Closing Healthcare Disparities in Kayunga and Beyond
            </h2>
            <p className="text-base text-muted-foreground">{MISSION}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Our focus areas: </span>
              {FOCUS_AREAS.map((a) => a.name).join(" · ")}
            </p>
            <div className="space-y-3 mt-1">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-base">Evidence-Based Interventions</h3>
                  <p className="text-muted-foreground text-sm">
                    Programs grounded in data, community insight, and global best practices.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-base">Community-Centered Programs</h3>
                  <p className="text-muted-foreground text-sm">
                    Designed with and for the communities we serve — addressing root causes, not
                    just symptoms.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-base">Local Capacity Building</h3>
                  <p className="text-muted-foreground text-sm">
                    Fostering local leadership and skills for health systems that sustain long after
                    we&apos;re there.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button asChild>
                <Link href="/contact?type=partner">
                  <HandHeart className="w-4 h-4 mr-2" />
                  Partner With Us
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/programs">View Our Programs</Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg min-h-[200px]">
            <SmartImage
              src="/img/dr6i.jpg"
              alt="Children in a rural community in Kayunga, Uganda, benefiting from BHI health programs."
              wrapperClassName="absolute inset-0"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge
                className="bg-primary/90 text-white backdrop-blur-sm border-0 text-sm px-4 py-2 shadow"
              >
                Serving Kayunga, Mukono, Kamuli & Buyende Districts
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
