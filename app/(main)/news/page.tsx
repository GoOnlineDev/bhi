"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from 'react';
import { NewsHero, SearchBar, NewsGrid } from './_components';
import NewsletterForm from '@/components/newsletter-form';

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
    <div>
      <NewsHero />
      
      {/* News Grid Section */}
      <section id="news-grid" aria-labelledby="news-grid-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <NewsGrid 
            newsList={filteredNews}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </div>
      </section>

      {/* Stay Updated: newsletter signup */}
      <section aria-labelledby="news-subscribe-heading" className="bg-background">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-2xl mx-auto text-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <h2 id="news-subscribe-heading" className="text-2xl font-bold text-foreground mb-2">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">Get an email when we publish new news or programmes. Unsubscribe any time.</p>
            <NewsletterForm layout="inline" className="max-w-md mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
} 