"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryStyle } from "@/lib/service-category-styles";
import { FOCUS_AREAS, findServiceForArea, focusAreaHref } from "@/lib/site-content";
import type { Doc } from "@/convex/_generated/dataModel";

type PillarCard = { key: string; href: string; label: string; title: string; text: string; styleKey?: string; icon?: LucideIcon };

// Seven core programmes in the owner's order; admin services supply link and wording where they match.
function buildCards(spotlight: Doc<"services">[], published: Doc<"services">[]): PillarCard[] {
  const used = new Set<string>();
  const core = FOCUS_AREAS.map((area): PillarCard => {
    const hit = findServiceForArea(area, spotlight) ?? findServiceForArea(area, published);
    if (hit) used.add(hit._id);
    return {
      key: area.short,
      href: hit ? `/services/${hit._id}` : focusAreaHref(area, undefined),
      label: area.short,
      title: area.name,
      text: hit?.description || area.summary,
      styleKey: area.styleKey,
      icon: area.icon,
    };
  });
  // Admin spotlight items outside the seven areas stay visible after them.
  const extra = spotlight
    .filter((s) => !used.has(s._id))
    .map((s): PillarCard => ({ key: s._id, href: `/services/${s._id}`, label: s.shortTitle || s.category || "Programme", title: s.title, text: s.description, styleKey: s.category }));
  return [...core, ...extra];
}

function Pillar({ card, index }: { card: PillarCard; index: number }) {
  const style = getCategoryStyle(card.styleKey);
  const Icon = card.icon ?? style.icon;
  return (
    <Link href={card.href} className="group block h-full">
      <div className={`rounded-2xl p-5 border ${style.lightColor} ${style.borderColor} hover:shadow-lg transition-shadow duration-300 h-full flex flex-col`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-11 h-11 ${style.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" aria-hidden />
          </div>
          <span className={`text-xs font-bold ${style.textColor}`}>{String(index + 1).padStart(2, "0")}</span>
          <Badge variant="outline" className={`text-xs ${style.textColor} border-current`}>{card.label}</Badge>
        </div>
        <h3 className={`text-lg font-bold mb-2 ${style.textColor} group-hover:underline`}>{card.title}</h3>
        <p className="text-sm text-foreground leading-relaxed line-clamp-4 flex-1">{card.text}</p>
        <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${style.textColor}`}>
          Learn more
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
        </div>
      </div>
    </Link>
  );
}

export default function PillarsSection() {
  const spotlight = useQuery(api.services.getSpotlightServices);
  const published = useQuery(api.services.getPublishedServices);
  const loading = spotlight === undefined || published === undefined;
  const cards = loading ? [] : buildCards(spotlight, published);

  return (
    <section className="bg-secondary" aria-labelledby="pillars-heading">
      <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">What We Do</Badge>
          <h2 id="pillars-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Our Core Programmes
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Seven areas of work that bring health knowledge, screening, referrals and care closer to
            communities in Kayunga and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {loading
            ? FOCUS_AREAS.map((a) => <Skeleton key={a.short} className="h-56 rounded-2xl" />)
            : cards.map((card, i) => <Pillar key={card.key} card={card} index={i} />)}
        </div>

        <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="default">
            <Link href="/services">
              See everything we do <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
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
