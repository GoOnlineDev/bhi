"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import NewsCard from './news-card';

interface NewsGridProps {
  newsList: any[] | undefined;
  isLoading: boolean;
  searchQuery: string;
}

export default function NewsGrid({ newsList, isLoading, searchQuery }: NewsGridProps) {
  if (isLoading) {
    return (
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
    );
  }

  if (!newsList || newsList.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-semibold text-foreground mb-2">No Articles Found</h3>
        <p className="text-muted-foreground">
          {searchQuery 
            ? "Try adjusting your search query to find what you're looking for."
            : "There are no news articles available at the moment. Please check back later."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {newsList.map((article) => (
        <NewsCard key={article._id} article={article} />
      ))}
    </div>
  );
} 