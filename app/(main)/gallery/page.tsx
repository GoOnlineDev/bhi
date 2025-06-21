"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "@/components/ui/video-player";
import { 
  Camera, 
  Video, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Filter,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  Eye
} from "lucide-react";

type MediaItem = {
  _id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  date: number;
  location?: string;
  tags: string[];
};

// Sample gallery data - in a real app, this would come from a database/API
// const galleryData: MediaItem[] = [
//   ... (commenting out static data)
// ];

const categories = [
  "All",
  "Maternal Health",
  "Education",
  "Mental Health",
  "Clinical Services",
  "Laboratory",
  "Facilities",
  "Community Outreach",
  "Youth Services",
  "Nursing",
  "Environmental Health",
  "Training"
];

export default function GalleryPage() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mediaType, setMediaType] = useState<"all" | "images" | "videos">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Query gallery data from database
  const galleryData = useQuery(api.gallery.getPublishedGallery);
  const galleryStats = useQuery(api.gallery.getGalleryStats);

  // Convert database data to MediaItem format
  const convertedGalleryData: MediaItem[] = (galleryData || []).map(item => ({
    _id: item._id,
    type: item.type,
    url: item.url,
    thumbnail: item.thumbnail,
    title: item.title,
    description: item.description,
    category: item.category,
    date: item.date,
    location: item.location,
    tags: item.tags,
  }));

  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);

  // Filter media based on category and type
  useEffect(() => {
    let filtered = convertedGalleryData;

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by media type
    if (mediaType === "images") {
      filtered = filtered.filter(item => item.type === "image");
    } else if (mediaType === "videos") {
      filtered = filtered.filter(item => item.type === "video");
    }

    setFilteredMedia(filtered);
  }, [activeCategory, mediaType, convertedGalleryData]);

  const openMediaModal = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia) return;
    
    const currentIndex = filteredMedia.findIndex(item => item._id === selectedMedia._id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredMedia.length - 1;
    } else {
      newIndex = currentIndex < filteredMedia.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedMedia(filteredMedia[newIndex]);
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
  }, [selectedMedia, filteredMedia]);

  // Show loading state
  if (!galleryData) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f37c1b] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#f37c1b] to-[#ff9d4d] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold mb-6">
              <Camera className="w-4 h-4 mr-2" />
              Our Gallery
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Capturing Our Impact
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Explore our photo and video gallery showcasing the transformative work of 
              Boost Health Initiative across Uganda's communities.
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-[#f37c1b] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Media Type Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMediaType("all")}
                className={`p-2 rounded-lg transition-colors ${
                  mediaType === "all" ? "bg-[#f37c1b] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMediaType("images")}
                className={`p-2 rounded-lg transition-colors ${
                  mediaType === "images" ? "bg-[#f37c1b] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMediaType("videos")}
                className={`p-2 rounded-lg transition-colors ${
                  mediaType === "videos" ? "bg-[#f37c1b] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Video className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-[#f37c1b] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-[#f37c1b] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {mediaType !== "all" && ` (${mediaType})`}
          </p>
        </div>

        {/* Gallery Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <Card
                key={item._id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                onClick={() => openMediaModal(item)}
              >
                <div className="relative aspect-square">
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <>
                      <Image
                        src={item.thumbnail || item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                          <Play className="w-8 h-8 text-[#f37c1b] ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#f37c1b]/90 text-white">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    {item.type === "video" ? (
                      <Video className="w-5 h-5 text-white" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/0 group-hover:bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[#1c140d] mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredMedia.map((item) => (
              <Card
                key={item._id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => openMediaModal(item)}
              >
                <div className="flex items-center gap-6 p-6">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    {item.type === "image" ? (
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <Image
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1c140d] mb-2 group-hover:text-[#f37c1b] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <Badge variant="outline">{item.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.type === "video" ? (
                          <Video className="w-5 h-5 text-[#f37c1b]" />
                        ) : (
                          <Camera className="w-5 h-5 text-[#f37c1b]" />
                        )}
                        <Eye className="w-5 h-5 text-gray-400 group-hover:text-[#f37c1b] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredMedia.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more content.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setMediaType("all");
              }}
              className="px-4 py-2 bg-[#f37c1b] text-white rounded-lg hover:bg-[#ff9d4d] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeMediaModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {filteredMedia.length > 1 && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Media Content */}
            <div className="max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
              <div className="flex-1 flex items-center justify-center w-full">
                {selectedMedia.type === "image" ? (
                  <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
                    <Image
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center max-w-4xl max-h-[80vh]">
                    <VideoPlayer
                      src={selectedMedia.url}
                      className="max-w-full max-h-full"
                      controls={true}
                      autoPlay={true}
                    />
                  </div>
                )}
              </div>

              {/* Media Info */}
              <div className="w-full max-w-4xl bg-black/50 backdrop-blur-sm rounded-lg p-6 mt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {selectedMedia.title}
                    </h2>
                    <p className="text-white/80 mb-4">
                      {selectedMedia.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                      <Badge className="bg-[#f37c1b]">
                        {selectedMedia.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedMedia.date).toLocaleDateString()}</span>
                      </div>
                      {selectedMedia.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedMedia.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Counter */}
            {filteredMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {filteredMedia.findIndex(item => item._id === selectedMedia._id) + 1} / {filteredMedia.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 