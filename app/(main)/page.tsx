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

export default function Home() {
  const news = useQuery(api.news.getPublishedNews);
  const featuredPrograms = useQuery(api.programs.getFeaturedApprovedPrograms);

  const isLoading = news === undefined || featuredPrograms === undefined;

  return (
    <main className="flex-1 w-full">
      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Empowering Communities Through Health
            </h1>
            <p className="text-lg text-muted-foreground">
              Boost Health Initiative is dedicated to improving health outcomes and empowering women in rural Uganda through comprehensive programs and community engagement.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/programs">
                  Explore Our Programs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Get Involved</Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
             <Image
              src="/img/dr7.jpg"
              alt="A healthcare worker smiling with a community member."
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Impact Card Section */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div
            className="relative bg-cover bg-center flex flex-col items-center justify-center rounded-2xl min-h-[300px] text-center p-8 overflow-hidden"
          >
             <Image
                src="/img/dr6.jpg"
                alt="A group of smiling children in a rural village."
                fill
                className="object-cover"
                loading="lazy"
              />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
            <div className="relative text-white">
              <h2 className="text-4xl lg:text-5xl font-bold">15M+ Lives Impacted</h2>
              <p className="text-xl mt-2">Across 4 Districts in Uganda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section id="latest-updates" aria-labelledby="latest-updates-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8">
            <h2 id="latest-updates-heading" className="text-3xl lg:text-4xl font-bold text-foreground">
              Latest Updates
            </h2>
            <div className="flex gap-4">
              <Button asChild variant="ghost" className="text-primary hover:text-primary">
                <Link href="/news">All News <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-[400px] rounded-lg" />
              <Skeleton className="h-[400px] rounded-lg" />
              <Skeleton className="h-[400px] rounded-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured Programs */}
              {featuredPrograms?.slice(0, 1).map((program) => (
                <Link key={program._id} href={`/programs/${program._id}`} className="lg:col-span-2 block group">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative w-full aspect-video">
                       {program.images && program.images[0] ? (
                        <Image src={program.images[0]} alt={program.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-secondary" />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm font-semibold text-primary mb-2">Featured Program</p>
                      <h3 className="text-xl font-bold text-foreground mb-2">{program.name}</h3>
                      <p className="text-muted-foreground line-clamp-2 mb-4">{program.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
              <div className="flex flex-col gap-6">
                {news?.slice(0, 3).map((item) => (
                  <Link key={item._id} href={`/news/${item._id}`} className="group">
                    <Card className="flex gap-4 p-4 hover:bg-secondary transition-colors h-full">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                        {item.images && item.images[0] ? (
                          <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <Newspaper className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{item.category}</p>
                        <h4 className="font-semibold text-foreground line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-auto flex items-center gap-1.5">
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
            <p className="text-muted-foreground text-center py-8">No news or programs available at the moment.</p>
          )}
        </div>
      </section>
    </main>
  );
}