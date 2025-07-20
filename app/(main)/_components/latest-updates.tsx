"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Newspaper, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestUpdates() {
  const news = useQuery(api.news.getPublishedNews);
  const featuredPrograms = useQuery(api.programs.getFeaturedApprovedPrograms);

  const isLoading = news === undefined || featuredPrograms === undefined;

  return (
    <section
      id="latest-updates"
      aria-labelledby="latest-updates-heading"
      className="w-full flex flex-col justify-center"
    >
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8">
          <h2
            id="latest-updates-heading"
            className="text-3xl lg:text-4xl font-bold"
          >
            Latest Updates
          </h2>
          <Button
            asChild
            variant="link"
            className="text-primary hover:text-primary/90"
          >
            <Link href="/news">
              All News <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="min-w-[320px] h-[400px] rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0"
                />
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Skeleton className="h-[100px] rounded-lg bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-[100px] rounded-lg bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-[100px] rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ) : (
          <>
            {/* Programs horizontal scroll */}
            {featuredPrograms && featuredPrograms.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 mb-8 -mx-2 px-2">
                {featuredPrograms.map((program) => (
                  <Link
                    key={program._id}
                    href={`/programs/${program._id}`}
                    className="block group min-w-[320px] max-w-xs flex-shrink-0"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="relative w-full aspect-video">
                        {program.images && program.images[0] ? (
                          <Image
                            src={program.images[0]}
                            alt={program.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
                        )}
                      </div>
                      <CardContent className="p-6">
                        <p className="text-sm font-semibold text-primary mb-2">
                          Featured Program
                        </p>
                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                          {program.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{program.location}</span>
                          </div>
                          <Badge
                            variant={
                              program.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {program.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Latest News Column */}
            <div className="flex flex-col gap-6">
              {news?.slice(0, 3).map((item) => (
                <Link
                  key={item._id}
                  href={`/news/${item._id}`}
                  className="group"
                >
                  <Card className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors border border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30">
                    <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 rounded-md overflow-hidden">
                      {item.images && item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <Newspaper className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {item.category}
                      </p>
                      <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-auto flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(item.publishedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}

        {!isLoading &&
          (!news || news.length === 0) &&
          (!featuredPrograms || featuredPrograms.length === 0) && (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No news or programs available at the moment.
            </p>
          )}
      </div>
    </section>
  );
}