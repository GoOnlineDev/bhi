"use client";

import SmartImage from "@/components/ui/smart-image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, HandHeart } from "lucide-react";
import { WHY_BHI } from "@/lib/site-content";

export default function MissionSection() {
  return (
    <section className="bg-background flex items-center" aria-labelledby="why-bhi-heading">
      <div className="container mx-auto px-4 py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4 md:order-last">
            <Badge variant="outline" className="self-start">Why Work With BHI?</Badge>
            <h2 id="why-bhi-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              More Than Treating Illness
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Meaningful improvements in healthcare require more than treating illness. They require
              empowering communities, strengthening local health systems and building sustainable
              partnerships.
            </p>
            <ul className="space-y-3 mt-1">
              {WHY_BHI.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                  <span className="text-foreground text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl bg-secondary p-5 sm:p-6">
              <h3 className="font-semibold text-foreground text-lg mb-2">Become Part of the Change</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Whether you are a development organisation, healthcare institution, corporate partner,
                researcher, healthcare professional or individual who shares our vision, there is an
                opportunity to work together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link href="/contact?type=partner">
                    <HandHeart className="w-4 h-4 mr-2" aria-hidden />
                    Partner With Us
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/about#get-involved">Support Our Work</Link>
                </Button>
              </div>
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
