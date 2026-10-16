"use client";

import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export default function NewsHero() {
  return (
    <section id="news-hero" aria-labelledby="news-hero-heading" className="bg-background">
      <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24 text-center">
        <h1 id="news-hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
          Health News & Updates from Kayunga, Uganda
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Stay informed with our recent activities, achievements, and community health impact stories from Kayunga, Uganda.
        </p>
      </div>
    </section>
  );
} 