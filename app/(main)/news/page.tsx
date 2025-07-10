"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';

export default function NewsPage() {
  const newsList = useQuery(api.news.getPublishedNews);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = newsList === undefined;

  const filteredNews = useMemo(() => {
    if (!newsList) return [];
    const q = searchQuery.toLowerCase();
    return newsList.filter((n) => 
      n.title.toLowerCase().includes(q) ||
      (n.summary && n.summary.toLowerCase().includes(q)) ||
      (n.category && n.category.toLowerCase().includes(q))
    );
  }, [newsList, searchQuery]);

  return (
    <main>
       {/* Hero Section */}
      <section id="news-hero" aria-labelledby="news-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <Badge variant="outline" className="mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Latest News
          </Badge>
          <h1 id="news-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Updates from the Field
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Stay informed with our recent activities, achievements, and community impact stories from across Uganda.
          </p>
        </div>
      </section>

      {/* News Grid Section */}
      <section id="news-grid" aria-labelledby="news-grid-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          {/* Search and Filters */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title, category, or keyword..."
                className="w-full pl-10"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <Link
                  key={article._id}
                  href={`/news/${article._id}`}
                  className="group block h-full"
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-background">
                    <div className="relative h-48 overflow-hidden">
                      {article.images && article.images.length > 0 ? (
                        <Image
                          src={article.images[0]}
                          alt={article.title || 'News article image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                          <Calendar className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute bottom-4 left-4 right-4">
                        {article.category && <Badge>{article.category}</Badge>}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-foreground mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search query to find what you're looking for."
                  : "There are no news articles available at the moment. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
} 