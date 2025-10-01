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
          className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2
            id="latest-updates-heading"
            className="text-3xl lg:text-4xl font-bold"
            style={{ color: "#f37c1b" }}
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
          </motion.div>
        ) : (
          <>
            {/* Programs horizontal scroll */}
            {featuredPrograms && featuredPrograms.length > 0 && (
              <motion.div 
                className="flex gap-4 overflow-x-auto pb-2 mb-8 -mx-2 px-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {featuredPrograms.map((program, index) => (
                  <motion.div
                    key={program._id}
                    variants={itemVariants}
                                         whileHover={{ 
                       y: -8,
                       transition: { duration: 0.2, ease: easeOut }
                     }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={`/programs/${program._id}`}
                      className="block group min-w-[320px] max-w-xs flex-shrink-0"
                    >
                      <motion.div
                        variants={cardVariants}
                        whileHover={{ 
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Card className="h-full overflow-hidden transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <div className="relative w-full aspect-video">
                            {program.images && program.images[0] ? (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Image
                                  src={program.images[0]}
                                  alt={program.name}
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            ) : (
                              <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
                            )}
                          </div>
                          <CardContent className="p-6">
                            <motion.p 
                              className="text-sm font-semibold text-primary mb-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              Featured Program
                            </motion.p>
                            <motion.h3 
                              className="text-xl font-bold mb-2 text-slate-900 dark:text-white"
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
                                     whileHover={{ 
                     x: 8,
                     transition: { duration: 0.2, ease: easeOut }
                   }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={`/news/${item._id}`}
                    className="group"
                  >
                    <Card className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors border border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30">
                      <motion.div 
                        className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 rounded-md overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
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
                      </motion.div>
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