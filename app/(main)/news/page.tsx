"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from 'react';
import { NewsHero, SearchBar, NewsGrid } from './_components';

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
    </main>
  );
} 