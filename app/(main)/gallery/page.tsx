"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import SmartImage from "@/components/ui/smart-image";
import VideoThumb from "@/components/ui/video-thumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import VideoPlayer from "@/components/ui/video-player";
import { 
  Camera, 
  Video, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Grid3X3,
  List,
  Search
} from "lucide-react";
import { format } from "date-fns";


type MediaItem = {
  _id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  date: number;
  tags: string[];
};


export default function GalleryPage() {

  const allMedia = useQuery(api.gallery.getPublishedGallery);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mediaType, setMediaType] = useState<"all" | "images" | "videos">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = allMedia === undefined;

  const convertedMedia: MediaItem[] = useMemo(() => {
    if (!allMedia) return [];
    return allMedia
      // Only url is truly required; previously items missing any optional field
      // (description, category, date) were silently hidden from the public gallery.
      .filter(item => item.url)
      .map(item => ({
        _id: item._id,
        type: (item.type ?? 'image') as 'image' | 'video',
        url: item.url!,
        thumbnail: item.thumbnail,
        title: item.title ?? '',
        description: item.description ?? '',
        category: item.category ?? '',
        date: item.date ?? item.createdAt,
        tags: item.tags || [],
      }));
  }, [allMedia]);

  // Category options come from the published items themselves, so every admin category is reachable.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(convertedMedia.map(m => m.category).filter(Boolean))).sort()],
    [convertedMedia],
  );

  const filteredMedia = useMemo(() => {
    return convertedMedia.filter(item => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const typeMatch = mediaType === "all" || (mediaType === "images" && item.type === "image") || (mediaType === "videos" && item.type === "video");
      const searchMatch = searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || (item.tags && item.tags.join(" ").toLowerCase().includes(searchQuery.toLowerCase()));
      return categoryMatch && typeMatch && searchMatch;
    });
  }, [convertedMedia, activeCategory, mediaType, searchQuery]);

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia) return;
    const currentIndex = filteredMedia.findIndex(item => item._id === selectedMedia._id);
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredMedia.length) % filteredMedia.length
      : (currentIndex + 1) % filteredMedia.length;
    setSelectedMedia(filteredMedia[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedMedia) {
        if (e.key === 'ArrowLeft') navigateMedia('prev');
        if (e.key === 'ArrowRight') navigateMedia('next');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMedia, filteredMedia]);

  const renderMediaContent = (item: MediaItem) => {
    if (item.type === 'video') {
      return <VideoPlayer src={item.url} className="w-full h-full object-contain" autoPlay controls />;
    }
    return <Image src={item.url} alt={item.title || "Gallery photo"} fill sizes="100vw" className="object-contain" />;
  };

  return (
    <div>
       {/* Hero Section */}
      <section id="gallery-hero" aria-labelledby="gallery-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24 text-center">
            <h1 id="gallery-hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">Capturing Our Impact in Kayunga, Uganda</h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore our photo and video gallery showcasing the transformative health work of Boost Health Initiative in Kayunga, Uganda.
            </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery-grid" aria-labelledby="gallery-grid-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          {/* Controls */}
          {/* Single filter toolbar (previously two rows that both had an "All" button) */}
          <div className="mb-10 flex flex-col lg:flex-row gap-3 lg:items-center justify-center">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search by title or tag..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background" aria-label="Search gallery"/>
            </div>
            <label className="sr-only" htmlFor="gallery-category">Category</label>
            <select
              id="gallery-category"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat === "All" ? "All categories" : cat}</option>)}
            </select>
            <div className="inline-flex rounded-md border bg-background p-1" role="group" aria-label="Media type">
              {([["all", "All media", null], ["images", "Photos", Camera], ["videos", "Videos", Video]] as const).map(([val, label, Icon]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMediaType(val)}
                  aria-pressed={mediaType === val}
                  className={`px-3 py-1.5 text-sm rounded inline-flex items-center gap-1.5 ${mediaType === val ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : null}{label}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid view"><Grid3X3 className="w-4 h-4"/></Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="List view"><List className="w-4 h-4"/></Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
               {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
          ) : filteredMedia.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {filteredMedia.map(item => (
                  <Card key={item._id} onClick={() => setSelectedMedia(item)} className="cursor-pointer group overflow-hidden">
                    <div className="relative aspect-square bg-muted">
                      {item.type === 'image' ? (
                        <SmartImage src={item.thumbnail || item.url} alt={item.title || 'Gallery photo'} wrapperClassName="absolute inset-0"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw" className="group-hover:scale-110 transition-transform duration-300"/>
                      ) : (
                        <VideoThumb src={item.url} thumbnail={item.thumbnail} title={item.title} className="absolute inset-0" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"/>
                      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                        <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-2">{item.title}</h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {filteredMedia.map(item => (
                   <Card key={item._id} onClick={() => setSelectedMedia(item)} className="cursor-pointer group overflow-hidden flex flex-col md:flex-row">
                     <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 bg-muted">
                        {item.type === 'image' ? (
                          <SmartImage src={item.thumbnail || item.url} alt={item.title || 'Gallery photo'} wrapperClassName="absolute inset-0" sizes="(max-width: 768px) 100vw, 256px"/>
                        ) : (
                          <VideoThumb src={item.url} thumbnail={item.thumbnail} title={item.title} className="absolute inset-0" />
                        )}
                      </div>
                     <CardContent className="p-6">
                        {item.category && <Badge className="mb-2">{item.category}</Badge>}
                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                        {item.date ? <p className="text-xs text-muted-foreground">{format(new Date(item.date), 'MMMM dd, yyyy')}</p> : null}
                     </CardContent>
                   </Card>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-foreground mb-2">No Media Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedMedia} onOpenChange={(isOpen) => !isOpen && setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col p-0 !gap-0">
          {selectedMedia && (
            <>
              <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>{selectedMedia.title || "Gallery"}</DialogTitle>
                <DialogDescription>
                  {selectedMedia.description}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 relative bg-black/10 dark:bg-black/50">
                {renderMediaContent(selectedMedia)}
              </div>
              
              {filteredMedia.length > 1 && (
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
