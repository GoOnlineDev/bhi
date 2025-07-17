"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, CheckCircle, Newspaper, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Boost Health Initiative | Empowering Communities in Kayunga, Uganda";
    const metaDescription = document.querySelector('meta[name="description"]');
    const content = "Boost Health Initiative improves health outcomes in Kayunga, Uganda through community-centered health programs and services. Learn about our impact and how you can help.";
    if (metaDescription) {
      metaDescription.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
    // Structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'bhi-org-jsonld';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Boost Health Initiative",
      "url": "https://www.boosthealthinitiative.org",
      "logo": "https://www.boosthealthinitiative.org/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+256-772-670-744",
        "contactType": "Customer service"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Level 1 Ssebowa House, Plot 1 Ssekajja Road",
        "addressLocality": "Kayunga",
        "addressRegion": "Central Uganda",
        "postalCode": "0000",
        "addressCountry": "UG"
      }
    });
    // Remove old script if exists
    const old = document.getElementById('bhi-org-jsonld');
    if (old) old.remove();
    document.head.appendChild(script);
  }, []);

  const news = useQuery(api.news.getPublishedNews);
  const featuredPrograms = useQuery(api.programs.getFeaturedApprovedPrograms);

  const isLoading = news === undefined || featuredPrograms === undefined;

  return (
    <main className="flex-1 w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <Image
            src="/img/dr7.jpg"
            alt="A healthcare worker smiling with a community member."
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Empowering Kayunga Communities Through Health
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto">
              Boost Health Initiative is dedicated to improving health outcomes and empowering women in rural Uganda through comprehensive programs and community engagement.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/programs">
                  Explore Our Programs
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                <Link href="/contact">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="min-h-screen bg-background flex items-center">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 md:order-last">
              <Badge variant="outline">Our Mission</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                A Community-Centered Approach to Healthcare in Kayunga, Uganda
              </h2>
              <p className="text-lg text-muted-foreground">
                Founded to transform health outcomes, we focus on sustainable solutions that empower individuals and strengthen healthcare systems across Uganda.
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

      {/* Latest Updates Section */}
      <section id="latest-updates" aria-labelledby="latest-updates-heading" className="min-h-screen bg-slate-900 text-white flex flex-col justify-center">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-12">
            <h2 id="latest-updates-heading" className="text-3xl lg:text-4xl font-bold">
              Latest Updates
            </h2>
            <Button asChild variant="link" className="text-primary hover:text-primary/90">
              <Link href="/news">All News <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-[400px] rounded-lg bg-slate-800" />
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-[100px] rounded-lg bg-slate-800" />
                <Skeleton className="h-[100px] rounded-lg bg-slate-800" />
                <Skeleton className="h-[100px] rounded-lg bg-slate-800" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Featured Program */}
              {featuredPrograms?.slice(0, 1).map((program) => (
                <Link key={program._id} href={`/programs/${program._id}`} className="block group">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-slate-800 border-slate-700">
                    <div className="relative w-full aspect-video">
                       {program.images && program.images[0] ? (
                        <Image src={program.images[0]} alt={program.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-slate-700" />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm font-semibold text-primary mb-2">Featured Program</p>
                      <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>
                      <p className="text-slate-400 line-clamp-2 mb-4">{program.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4"/>
                          <span>{program.location}</span>
                        </div>
                        <Badge variant={program.status === "Active" ? "default" : "secondary"}>{program.status}</Badge>
                    </div>
                    </CardContent>
                  </Card>
                  </Link>
                ))}

              {/* Latest News Column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {news?.slice(0, 3).map((item) => (
                  <Link key={item._id} href={`/news/${item._id}`} className="group">
                    <Card className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-slate-800/60 transition-colors border-slate-700 bg-slate-800/30">
                      <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 rounded-md overflow-hidden">
                        {item.images && item.images[0] ? (
                          <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <Newspaper className="w-8 h-8 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{item.category}</p>
                        <h4 className="font-semibold text-white line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-auto flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                        </p>
                    </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(!isLoading && (!news || news.length === 0) && (!featuredPrograms || featuredPrograms.length === 0)) && (
            <p className="text-slate-400 text-center py-8">No news or programs available at the moment.</p>
          )}
        </div>
      </section>
    </main>
  );
}