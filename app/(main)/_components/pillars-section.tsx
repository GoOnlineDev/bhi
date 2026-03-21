"use client";

import Link from "next/link";
import { ArrowRight, Heart, Brain, ShieldAlert, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    id: "srhr",
    icon: Heart,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    number: "01",
    title: "Sexual & Reproductive Health Rights",
    shortTitle: "SRHR",
    tagline: "Family Planning · Post-Abortion Care · Teenage Pregnancy",
    description:
      "We provide confidential, youth-friendly SRHR services including family planning, post-abortion care, and teenage pregnancy support — addressing one of Uganda's most urgent adolescent health crises.",
  },
  {
    id: "ncd-management",
    icon: Brain,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    number: "02",
    title: "Non-Communicable Diseases",
    shortTitle: "NCDs",
    tagline: "Mental Health · Sickle Cell · Diabetes · Hypertension · Epilepsy",
    description:
      "NCDs are rising among Uganda's youth, yet most go undiagnosed. BHI delivers NCD screening, management, counseling, and patient support to tackle mental health, sickle cell disease, diabetes, and more.",
  },
  {
    id: "gbv-support",
    icon: ShieldAlert,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    number: "03",
    title: "Gender-Based Violence Response",
    shortTitle: "GBV",
    tagline: "Counseling · Court Support · Referrals · Welfare Services",
    description:
      "BHI provides trauma-informed counseling, court referrals, and survivor case management — creating safe pathways for those facing gender-based violence to access justice and healing.",
  },
  {
    id: "substance-abuse",
    icon: Pill,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    number: "04",
    title: "Substance Abuse Prevention & Recovery",
    shortTitle: "Substance Abuse",
    tagline: "Counseling · Training · Recovery & Adaptation Support",
    description:
      "Through community-based counseling, peer education, and recovery adaptation programs, BHI helps young people break free from substance dependency and rebuild healthy futures.",
  },
];

export default function PillarsSection() {
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
            Four Pillars of Youth Health Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Every BHI program addresses one of four critical health challenges facing Uganda&apos;s youth.
            Our integrated approach ensures no young person falls through the gaps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.id}
                href={`/services?category=${encodeURIComponent(pillar.shortTitle)}`}
                className="group block"
              >
                <div
                  className={`rounded-2xl p-6 border ${pillar.lightColor} ${pillar.borderColor} hover:shadow-lg transition-all duration-300 h-full`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 ${pillar.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${pillar.textColor} opacity-60`}>
                          {pillar.number}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${pillar.textColor} border-current`}
                        >
                          {pillar.shortTitle}
                        </Badge>
                      </div>
                      <h3 className={`text-xl font-bold mb-1 ${pillar.textColor} group-hover:underline`}>
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 italic">
                        {pillar.tagline}
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${pillar.textColor}`}>
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/about">
              Our Full Mission & Story <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
