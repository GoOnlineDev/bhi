"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="min-h-screen bg-background flex items-center">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 md:order-last">
            <Badge variant="outline">Our Mission</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              A Community-Centered Approach to Healthcare in Kayunga, Uganda
            </h2>
            <p className="text-lg text-muted-foreground">
              Founded in Kayunga, Uganda, with a mission to transform health outcomes, we focus on sustainable solutions that empower individuals and strengthen healthcare systems across Uganda.
            </p>
            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Evidence-Based Interventions</h3>
                  <p className="text-muted-foreground">To improve health and empower communities.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Community-Centered Programs</h3>
                  <p className="text-muted-foreground">Addressing root causes of health disparities.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Local Capacity Building</h3>
                  <p className="text-muted-foreground">Fostering local leadership for long-term success.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/img/dr6.jpg"
              alt="A group of smiling children in a rural village."
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 