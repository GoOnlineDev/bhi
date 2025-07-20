"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface NewsCardProps {
  article: {
    _id: string;
    title: string;
    summary?: string;
    category?: string;
    publishedAt: string;
    images?: string[];
  };
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
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
  );
} 