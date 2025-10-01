"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="bg-background flex items-center">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4 md:order-last">
            <div
              className="inline-block"
              style={{
                background: "#f37c1b",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <span className="text-white font-semibold text-base">Our Mission</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground" style={{ color: "#f37c1b" }}>
              A Community-Centered Approach to Healthcare in Kayunga, Uganda
            </h2>
            <p className="text-base text-muted-foreground">
              Founded in Kayunga, Uganda, with a mission to transform health outcomes, we focus on sustainable solutions that empower individuals and strengthen healthcare systems across Uganda.
            </p>
            <div className="space-y-2 mt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground text-base">Evidence-Based Interventions</h3>
                  <p className="text-muted-foreground text-sm">To improve health and empower communities.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground text-base">Community-Centered Programs</h3>
                  <p className="text-muted-foreground text-sm">Addressing root causes of health disparities.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground text-base">Local Capacity Building</h3>
                  <p className="text-muted-foreground text-sm">Fostering local leadership for long-term success.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg min-h-[200px]">
            <Image
              src="/img/dr6i.jpg"
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