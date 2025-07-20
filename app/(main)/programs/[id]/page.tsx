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
import { Calendar, MapPin, User, Phone, Mail, ArrowLeft, Clock, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type MediaItem = {
  type: 'image' | 'video';
  url: string;
  index: number;
};


const ProgramDetailsSkeleton = () => (
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

export default function ProgramDetailsPage() {
  const params = useParams();
  const programId = params.id as Id<"programs">;
  
  const program = useQuery(api.programs.getProgramById, { id: programId });
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);

  // Create combined media array when program data is available
  const createMediaArray = () => {
    if (!program) return [];
    
    const media: MediaItem[] = [];
    
    // Add images
    if (program.images) {
      program.images.forEach((url, index) => {
        media.push({ type: 'image', url, index });
      });
    }
    
    // Add videos
    if (program.videos) {
      program.videos.forEach((url, index) => {
        media.push({ type: 'video', url, index: (program.images?.length || 0) + index });
      });
    }
    
    return media;
  };

  // Update media array when program changes
  useEffect(() => {
    if (program) {
      setAllMedia(createMediaArray());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  useEffect(() => {
    if (program) {
      document.title = `${program.name} | Health Program in Kayunga`;
      const metaDescription = document.querySelector('meta[name="description"]');
      const content = program.description || `Discover health programs by Boost Health Initiative in Kayunga, Uganda. Learn more about our community impact.`;
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
      script.id = 'bhi-program-jsonld';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": program.name,
        "description": program.description || '',
        "provider": {
          "@type": "Organization",
          "name": "Boost Health Initiative",
          "url": "https://www.boosthealthinitiative.org"
        },
        "areaServed": {
          "@type": "Place",
          "name": program.location || 'Kayunga, Uganda'
        },
        "serviceType": program.status || 'Health Program',
        "image": program.images && program.images.length > 0 ? program.images[0] : undefined,
        "url": typeof window !== 'undefined' ? window.location.href : ''
      });
      // Remove old script if exists
      const old = document.getElementById('bhi-program-jsonld');
      if (old) old.remove();
      document.head.appendChild(script);
    }
  }, [program]);

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

  if (program === undefined) {
    return <ProgramDetailsSkeleton />;
  }

  if (program === null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Program Not Found</h1>
          <p className="text-muted-foreground mb-6">The program you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/programs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programs
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "ongoing":
        return "bg-green-100 text-green-700 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button variant="link" asChild className="p-0 h-auto">
              <Link 
                href="/programs"
                className="inline-flex items-center text-primary hover:text-primary/90 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Programs
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(program.status)} border`}>
                {program.status}
              </Badge>
              {program.isFeatured && (
                <Badge variant="outline" className="border-primary/50 text-primary">
                  Featured
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
            {program.images && program.images.length > 0 && (
              <section 
                aria-labelledby="program-hero"
                className="relative aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer group"
                onClick={() => openMediaModal({ type: 'image', url: program.images![0], index: 0 })}
              >
                <Image
                  src={program.images[0]}
                  alt={program.name}
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
                  <h1 id="program-hero" className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {program.name}
                  </h1>
                  {program.location && (
                    <div className="flex items-center text-white/90">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{program.location}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Program Details */}
            <section aria-labelledby="program-details-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardContent className="p-6">
                {!program.images?.length && (
                  <h1 id="program-details-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    {program.name}
                  </h1>
                )}
                
                <div className="prose prose-lg max-w-none prose-stone dark:prose-invert">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About This Program</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {program.description}
                  </p>
                </div>

                {program.goal && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold text-primary mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Program Goal
                    </h3>
                    <p className="text-muted-foreground">{program.goal}</p>
                  </div>
                )}
              </CardContent>
            </section>

            {/* Media Gallery - Combined Images and Videos */}
            {allMedia.length > (program.images?.length === 1 ? 0 : 1) && (
              <section aria-labelledby="media-gallery-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardContent className="p-6">
                  <h2 id="media-gallery-heading" className="text-xl font-semibold text-foreground mb-4">Media Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {program.images && program.images.slice(1).map((image, index) => (
                      <div 
                        key={`image-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-muted"
                        onClick={() => openMediaModal({ type: 'image', url: image, index: index + 1 })}
                      >
                        <Image
                          src={image}
                          alt={`${program.name} - Image ${index + 2}`}
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
                    
                    {program.videos && program.videos.map((video, index) => (
                      <div 
                        key={`video-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-muted"
                        onClick={() => openMediaModal({ type: 'video', url: video, index: (program.images?.length || 0) + index })}
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
            <section aria-labelledby="program-info-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardContent className="p-6">
                <h2 id="program-info-heading" className="text-lg font-semibold text-foreground mb-4">Program Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Start Date</p>
                      <p className="text-muted-foreground">
                        {new Date(program.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground/80">
                        {formatDistanceToNow(new Date(program.startDate), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {program.endDate && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">End Date</p>
                        <p className="text-muted-foreground">
                          {new Date(program.endDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {program.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Location</p>
                        <p className="text-muted-foreground">{program.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </section>

            {(program.contactPerson || program.contactEmail || program.contactPhone) && (
              <section aria-labelledby="contact-info-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardContent className="p-6">
                  <h2 id="contact-info-heading" className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    {program.contactPerson && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Contact Person</p>
                          <p className="text-muted-foreground">{program.contactPerson}</p>
                        </div>
                      </div>
                    )}

                    {program.contactEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Email</p>
                          <a 
                            href={`mailto:${program.contactEmail}`}
                            className="text-primary hover:text-primary/90 transition-colors"
                          >
                            {program.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    {program.contactPhone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Phone</p>
                          <a 
                            href={`tel:${program.contactPhone}`}
                            className="text-primary hover:text-primary/90 transition-colors"
                          >
                            {program.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </section>
            )}

            {program.tags && program.tags.length > 0 && (
              <section aria-labelledby="tags-heading" className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardContent className="p-6">
                  <h2 id="tags-heading" className="text-lg font-semibold text-foreground mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {program.tags.map((tag, index) => (
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
                <h2 className="text-lg font-semibold text-foreground mb-2">Interested in This Program?</h2>
                <p className="text-muted-foreground mb-4">Get in touch to learn more or participate.</p>
                <Button asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
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
                <DialogTitle>{program.name}</DialogTitle>
                <DialogDescription>
                  Media {allMedia.findIndex(item => item.url === selectedMedia.url) + 1} of {allMedia.length}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 relative bg-black/10 dark:bg-black/50">
                {selectedMedia.type === 'image' ? (
                  <Image src={selectedMedia.url} alt={program.name} fill className="object-contain" />
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