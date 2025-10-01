"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
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

const categories = [
  "All", "Maternal Health", "Education", "Mental Health", "Clinical Services", 
  "Community Outreach", "Youth Services", "Facilities"
];

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
      .filter(item => item.type && item.url && item.title && item.description && item.category && item.date)
      .map(item => ({
        _id: item._id,
        type: item.type as 'image' | 'video',
        url: item.url!,
        thumbnail: item.thumbnail,
        title: item.title!,
        description: item.description!,
        category: item.category!,
        date: item.date!,
        tags: item.tags || [],
      }));
  }, [allMedia]);

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
    return <Image src={item.url} alt={item.title} fill className="object-contain" />;
  };

  return (
    <main>
       {/* Hero Section */}
      <section id="gallery-hero" aria-labelledby="gallery-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <Badge variant="outline" className="mb-6">
              <Camera className="w-4 h-4 mr-2" />
              Our Gallery
            </Badge>
            <h1 id="gallery-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">Capturing Our Impact in Kayunga, Uganda</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore our photo and video gallery showcasing the transformative health work of Boost Health Initiative in Kayunga, Uganda.
            </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery-grid" aria-labelledby="gallery-grid-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          {/* Controls */}
          <div className="mb-12 space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <div className="relative w-full md:w-auto md:flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="text" placeholder="Search by title or tag..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={mediaType === 'all' ? 'default' : 'outline'} onClick={() => setMediaType('all')}>All</Button>
                <Button variant={mediaType === 'images' ? 'default' : 'outline'} onClick={() => setMediaType('images')}><Camera className="w-4 h-4 mr-2"/>Images</Button>
                <Button variant={mediaType === 'videos' ? 'default' : 'outline'} onClick={() => setMediaType('videos')}><Video className="w-4 h-4 mr-2"/>Videos</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid3X3 className="w-4 h-4"/></Button>
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4"/></Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <Button key={cat} variant={activeCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory(cat)}>
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
          ) : filteredMedia.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map(item => (
                  <Card key={item._id} onClick={() => setSelectedMedia(item)} className="cursor-pointer group overflow-hidden">
                    <div className="relative aspect-square bg-muted">
                      {item.type === 'image' ? (
                        <Image src={item.thumbnail || item.url} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300"/>
                      ) : (
                        <video
                            src={`${item.url}#t=0.1`}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold line-clamp-2">{item.title}</h3>
                      </div>
                      {item.type === 'video' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white opacity-75 group-hover:opacity-100 transition-opacity"><Video className="w-6 h-6"/></div>}
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
                          <Image src={item.thumbnail || item.url} alt={item.title} fill className="object-cover"/>
                        ) : (
                          <video
                              src={`${item.url}#t=0.1`}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                          />
                        )}
                        {item.type === 'video' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white opacity-75 group-hover:opacity-100 transition-opacity"><Video className="w-6 h-6"/></div>}
                      </div>
                     <CardContent className="p-6">
                        <Badge className="mb-2">{item.category}</Badge>
                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(item.date), 'MMMM dd, yyyy')}</p>
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
                <DialogTitle>{selectedMedia.title}</DialogTitle>
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
    </main>
  );
} 