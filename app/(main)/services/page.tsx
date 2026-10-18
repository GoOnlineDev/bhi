"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import SmartImage from "@/components/ui/smart-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layers,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getCategoryStyle } from "@/lib/service-category-styles";
import { unclaimedCorePrograms, type ServiceContent } from "@/lib/core-programs";

type ListItem = ServiceContent & { key: string; href: string };

function ServiceCard({ item }: { item: ListItem }) {
  const cfg = getCategoryStyle(item.category);
  const Icon = cfg.icon;
  const heroImg = item.heroImage || item.images?.[0];

  return (
    <Link href={item.href} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md">
        {/* Always render the image area so cards line up; SmartImage shows a branded fallback when empty */}
        <div className="relative h-44 w-full overflow-hidden">
            <SmartImage src={heroImg} alt={item.title} wrapperClassName="absolute inset-0" fallbackLabel={item.category ?? undefined}
              className="group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            {item.isFeatured && (
              <Badge className="absolute top-3 left-3 bg-amber-500 text-white border-0">Featured</Badge>
            )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-8 h-8 ${cfg.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            {item.category && (
              <Badge variant="outline" className={`text-xs ${cfg.textColor} border-current`}>
                {item.category}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-300">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
            {item.description}
          </p>
          {item.benefits && item.benefits.length > 0 && (
            <ul className="space-y-1 mb-4">
              {item.benefits.slice(0, 3).map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className={`w-3.5 h-3.5 ${cfg.textColor} flex-shrink-0`} />
                  <span className="line-clamp-1">{b}</span>
                </li>
              ))}
            </ul>
          )}
          <div className={`flex items-center text-sm font-medium ${cfg.textColor}`}>
            Learn More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-md">
          <Skeleton className="h-44 w-full rounded-none" />
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-5/6 mb-2" />
            <Skeleton className="h-3 w-4/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ServicesPageInner() {
  const convexServices = useQuery(api.services.getPublishedServices);
  const isLoading = convexServices === undefined;
  // Built-in core programme pages fill gaps until admins publish a matching service.
  const services: ListItem[] | undefined = convexServices && [
    ...convexServices.map((s) => ({ ...s, key: s._id, href: `/services/${s._id}` })),
    ...unclaimedCorePrograms(convexServices).map((p) => ({ ...p, key: p.slug, href: `/services/${p.slug}` })),
  ];
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  const categories = ["All", ...Array.from(new Set((services || []).map(s => s.category).filter((c): c is string => typeof c === "string")))];

  const filtered = (services || []).filter(s => {
    const matchesSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered.filter(s => s.isFeatured);
  const rest = filtered.filter(s => !s.isFeatured);

  return (
    <div>
      {/* Hero */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            What We Do
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            BHI works across seven core programmes — from maternal, newborn and child health and
            sexual and reproductive health to gender-based violence, disease prevention, mental
            health, community health systems and research — bringing health information, screening
            and referrals closer to communities in Kayunga and beyond.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-secondary sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search our work..."
                aria-label="Search our work"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-white"
                      : "bg-background text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          {isLoading ? (
            <ServicesSkeleton />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Nothing Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-bold text-foreground">Featured Initiatives</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map(item => <ServiceCard key={item.key} item={item} />)}
                  </div>
                </div>
              )}
              {rest.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <h2 className="text-xl font-bold text-foreground mb-6">All Initiatives</h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map(item => <ServiceCard key={item.key} item={item} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-14 sm:py-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-white text-center">
              <ShieldAlert className="w-10 h-10 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl font-bold mb-3">Need Help Right Now?</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                If you or someone you know is facing a health emergency, GBV situation, or substance
                crisis — reach out. Your inquiry can be kept confidential.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold w-full" asChild>
                <Link href="/contact?type=help">Get Help Now</Link>
              </Button>
            </div>
            <div className="bg-background rounded-2xl p-8 text-center border border-border">
              <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-foreground mb-3">Partner or Fund Our Work</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We actively seek partnerships and grants to expand our services and reach more
                communities across Uganda.
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" asChild>
                  <Link href="/contact?type=partner">Become a Partner</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/programs">View Our Programs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ServicesPageInner />
    </Suspense>
  );
}
