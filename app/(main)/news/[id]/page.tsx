"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/ui/video-player";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, ArrowLeft, Clock, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type MediaItem = {
  type: 'image' | 'video';
  url: string;
  index: number;
};

const NewsDetailsSkeleton = () => (
    <div className="bg-background">
      <header className="bg-card border-b py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 rounded-md" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                </div>
            </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </CardContent>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </div>
          </div>
        </div>
      </main>
    </div>
);


export default function NewsDetailsPage() {
  const params = useParams();
  const newsId = params.id as Id<"news">;
  
  const news = useQuery(api.news.getNewsById, { id: newsId });
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);

  // Create combined media array when news data is available
  const createMediaArray = () => {
    if (!news) return [];
    
    const media: MediaItem[] = [];
    
    // Add images
    if (news.images) {
      news.images.forEach((url, index) => {
        media.push({ type: 'image', url, index });
      });
    }
    
    // Add videos
    if (news.videos) {
      news.videos.forEach((url, index) => {
        media.push({ type: 'video', url, index: (news.images?.length || 0) + index });
      });
    }
    
    return media;
  };

  // Update media array when news changes
  useEffect(() => {
    if (news) {
      setAllMedia(createMediaArray());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news]);

  useEffect(() => {
    if (news) {
      document.title = `${news.title} | Boost Health Initiative News, Kayunga`;
      const metaDescription = document.querySelector('meta[name="description"]');
      const content = news.summary || `Read the latest news from Boost Health Initiative in Kayunga, Uganda. Community health updates and stories.`;
      if (metaDescription) {
        metaDescription.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = content;
        document.head.appendChild(meta);
      }
      // Structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'bhi-news-jsonld';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": news.title,
        "description": news.summary || '',
        "datePublished": news.publishedAt ? new Date(news.publishedAt).toISOString() : undefined,
        "dateModified": news.updatedAt ? new Date(news.updatedAt).toISOString() : undefined,
        "author": {
          "@type": "Organization",
          "name": "Boost Health Initiative"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Boost Health Initiative",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.boosthealthinitiative.org/logo.png"
          }
        },
        "image": news.images && news.images.length > 0 ? news.images[0] : undefined,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": typeof window !== 'undefined' ? window.location.href : ''
        }
      });
      // Remove old script if exists
      const old = document.getElementById('bhi-news-jsonld');
      if (old) old.remove();
      document.head.appendChild(script);
    }
  }, [news]);

  const openMediaModal = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia || allMedia.length === 0) return;
    
    const currentIndex = allMedia.findIndex(item => 
      item.type === selectedMedia.type && item.url === selectedMedia.url
    );
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allMedia.length - 1;
    } else {
      newIndex = currentIndex < allMedia.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedMedia(allMedia[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedMedia) return;
      
      switch (e.key) {
        case 'Escape':
          closeMediaModal();
          break;
        case 'ArrowLeft':
          navigateMedia('prev');
          break;
        case 'ArrowRight':
          navigateMedia('next');
          break;
      }
    };

    if (selectedMedia) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMedia, allMedia]);

  if (news === undefined) {
    return <NewsDetailsSkeleton />;
  }

  if (news === null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">News Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The news article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Announcements": "bg-blue-100 text-blue-700 border-blue-200",
      "Health Tips": "bg-green-100 text-green-700 border-green-200",
      "Community Programs": "bg-purple-100 text-purple-700 border-purple-200",
      "Medical Updates": "bg-red-100 text-red-700 border-red-200",
      "Staff Highlights": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Success Stories": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Event Recaps": "bg-orange-100 text-orange-700 border-orange-200",
      "Policy Changes": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Emergency Alerts": "bg-rose-100 text-rose-700 border-rose-200",
      "Research & Innovation": "bg-cyan-100 text-cyan-700 border-cyan-200"
    };
    return colors[category] || "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button variant="link" asChild className="p-0 h-auto">
              <Link 
                href="/news"
                className="inline-flex items-center text-primary hover:text-primary/90 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to News
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Badge className={`${getCategoryColor(news.category)} border`}>
                {news.category}
              </Badge>
              {news.institution && (
                <Badge variant="secondary">
                  {news.institution}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            {news.images && news.images.length > 0 && (
              <section 
                aria-labelledby="news-hero"
                className="relative aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer group"
                onClick={() => openMediaModal({ type: 'image', url: news.images![0], index: 0 })}
              >
                <Image
                  src={news.images[0]}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 id="news-hero" className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {news.title}
                  </h1>
                  <p className="text-white/90 text-lg">
                    {news.summary}
                  </p>
                </div>
              </section>
            )}

            {/* Article Content */}
            <article aria-labelledby="article-content-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardContent className="p-6">
                {!news.images?.length && (
                  <>
                    <h1 id="article-content-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {news.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-6">
                      {news.summary}
                    </p>
                  </>
                )}
                
                <div className="prose prose-lg max-w-none prose-stone dark:prose-invert">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Article Details</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {news.content}
                  </div>
                </div>
              </CardContent>
            </article>

            {/* Media Gallery - Combined Images and Videos */}
            {allMedia.length > (news.images?.length === 1 ? 0 : 1) && (
              <section aria-labelledby="media-gallery-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardContent className="p-6">
                  <h2 id="media-gallery-heading" className="text-xl font-semibold text-foreground mb-4">Media Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {news.images && news.images.slice(1).map((image, index) => (
                      <div 
                        key={`image-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-muted"
                        onClick={() => openMediaModal({ type: 'image', url: image, index: index + 1 })}
                      >
                        <Image
                          src={image}
                          alt={`${news.title} - Image ${index + 2}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {news.videos && news.videos.map((video, index) => (
                      <div 
                        key={`video-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-muted"
                        onClick={() => openMediaModal({ type: 'video', url: video, index: (news.images?.length || 0) + index })}
                      >
                        <video
                          src={`${video}#t=0.1`}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                            <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section aria-labelledby="article-info-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardContent className="p-6">
                <h2 id="article-info-heading" className="text-lg font-semibold text-foreground mb-4">Article Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Published</p>
                      <p className="text-muted-foreground">
                        {new Date(news.publishedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground/80">
                        {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Event Date</p>
                      <p className="text-muted-foreground">
                        {new Date(news.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {news.endDate && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">End Date</p>
                        <p className="text-muted-foreground">
                          {new Date(news.endDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {news.updatedAt && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Last Updated</p>
                        <p className="text-muted-foreground">
                          {new Date(news.updatedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </section>

            {news.tags && news.tags.length > 0 && (
              <section aria-labelledby="tags-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardContent className="p-6">
                  <h2 id="tags-heading" className="text-lg font-semibold text-foreground mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </section>
            )}

            <section className="rounded-lg border text-card-foreground shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <h2 className="text-lg font-semibold text-foreground mb-2">Stay Updated</h2>
                <p className="text-muted-foreground mb-4">Get the latest news and updates from our programs.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button asChild>
                    <Link href="/news">
                      More News
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/programs">
                      Our Programs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </section>
          </aside>
        </div>
      </main>

      {/* Media Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={(isOpen) => !isOpen && setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col p-0 !gap-0">
          {selectedMedia && (
            <>
              <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>{news.title}</DialogTitle>
                <DialogDescription>
                  Media {allMedia.findIndex(item => item.url === selectedMedia.url) + 1} of {allMedia.length}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 relative bg-black/10 dark:bg-black/50">
                {selectedMedia.type === 'image' ? (
                  <Image src={selectedMedia.url} alt={news.title} fill className="object-contain" />
                ) : (
                  <VideoPlayer src={selectedMedia.url} className="w-full h-full object-contain" autoPlay controls />
                )}
              </div>
              
              {allMedia.length > 1 && (
                <>
                  <Button onClick={() => navigateMedia('prev')} variant="outline" size="icon" className="absolute z-10 left-2 top-1/2 -translate-y-1/2 md:left-4 bg-black/30 text-white border-white/20 hover:bg-black/50 hover:text-white">
                    <ChevronLeft className="w-6 h-6" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  <Button onClick={() => navigateMedia('next')} variant="outline" size="icon" className="absolute z-10 right-2 top-1/2 -translate-y-1/2 md:right-4 bg-black/30 text-white border-white/20 hover:bg-black/50 hover:text-white">
                    <ChevronRight className="w-6 h-6" />
                    <span className="sr-only">Next</span>
                  </Button>
                </>
              )}
              <Button onClick={() => setSelectedMedia(null)} variant="outline" size="icon" className="absolute z-10 top-2 right-2 bg-black/30 text-white border-white/20 hover:bg-black/50 hover:text-white">
                <X className="w-6 h-6" />
                <span className="sr-only">Close</span>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 