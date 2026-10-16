"use client";

import Link from "next/link";
import SmartImage from "@/components/ui/smart-image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, easeOut } from "framer-motion";

export default function LatestUpdates() {
  const news = useQuery(api.news.getPublishedNews);
  const featuredPrograms = useQuery(api.programs.getFeaturedApprovedPrograms);

  const isLoading = news === undefined || featuredPrograms === undefined;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  const newsItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  return (
    <section
      id="latest-updates"
      aria-labelledby="latest-updates-heading"
      className="w-full flex flex-col justify-center"
    >
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <motion.div 
          className="flex flex-row flex-wrap items-baseline justify-between gap-2 sm:gap-4 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2
            id="latest-updates-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground"
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
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-white overflow-hidden">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Skeleton className="h-[100px] rounded-lg bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-[100px] rounded-lg bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-[100px] rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </motion.div>
        ) : (
          <>
            {/* Programs horizontal scroll */}
            {featuredPrograms && featuredPrograms.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {featuredPrograms.map((program, index) => (
                  <motion.div
                    key={program._id}
                    variants={itemVariants}
                    className="h-full min-w-0"
                  >
                    <Link
                      href={`/programs/${program._id}`}
                      className="block group h-full"
                    >
                      <motion.div variants={cardVariants} className="h-full">
                        <Card className="h-full flex flex-col overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <SmartImage
                            src={program.images?.[0]}
                            alt={program.name}
                            wrapperClassName="w-full aspect-video"
                            className="group-hover:scale-105 transition-transform duration-500"
                            fallbackLabel={program.name}
                          />
                          <CardContent className="p-4 sm:p-6 min-w-0">
                            <motion.p 
                              className="text-sm font-semibold text-primary mb-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              Featured Program
                            </motion.p>
                            <motion.h3 
                              className="text-xl font-bold mb-2 text-slate-900 dark:text-white line-clamp-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                            >
                              {program.name}
                            </motion.h3>
                            <motion.p 
                              className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              {program.description}
                            </motion.p>
                            <motion.div 
                              className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                            >
                              {program.location ? (
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">{program.location}</span>
                                </div>
                              ) : null}
                              <Badge
                                variant={
                                  program.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {program.status}
                              </Badge>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Latest News Column */}
            <motion.div 
              className="flex flex-col gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {news?.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={newsItemVariants}
                >
                  <Link
                    href={`/news/${item._id}`}
                    className="group block"
                  >
                    <Card className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30">
                      <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 rounded-md overflow-hidden">
                        <SmartImage
                          src={item.images?.[0]}
                          alt={item.title}
                          wrapperClassName="absolute inset-0"
                          sizes="(max-width: 640px) 100vw, 128px"
                        />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <motion.p 
                          className="text-sm font-semibold text-primary truncate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {item.category}
                        </motion.p>
                        <motion.h4 
                          className="font-semibold text-slate-900 dark:text-white line-clamp-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          {item.title}
                        </motion.h4>
                        <motion.p 
                          className="text-xs text-slate-500 dark:text-slate-400 mt-auto flex items-center gap-1.5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(item.publishedAt), {
                            addSuffix: true,
                          })}
                        </motion.p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {!isLoading &&
          (!news || news.length === 0) &&
          (!featuredPrograms || featuredPrograms.length === 0) && (
            <motion.p 
              className="text-slate-500 dark:text-slate-400 text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No news or programs available at the moment.
            </motion.p>
          )}
      </div>
    </section>
  );
}
