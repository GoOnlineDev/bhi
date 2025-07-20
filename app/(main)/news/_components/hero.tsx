"use client";

import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export default function NewsHero() {
  return (
    <section id="news-hero" aria-labelledby="news-hero-heading" className="bg-background">
      <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
        <Badge variant="outline" className="mb-6">
          <Calendar className="w-4 h-4 mr-2" />
          Latest News
        </Badge>
        <h1 id="news-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Health News & Updates from Kayunga, Uganda
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Stay informed with our recent activities, achievements, and community health impact stories from Kayunga, Uganda.
        </p>
      </div>
    </section>
  );
} 