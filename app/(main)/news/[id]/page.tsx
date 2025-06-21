"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import VideoPlayer from "@/components/ui/video-player";
import { Calendar, MapPin, User, ArrowLeft, Clock, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type MediaItem = {
  type: 'image' | 'video';
  url: string;
  index: number;
};

export default function NewsDetailsPage() {
  const params = useParams();
  const router = useRouter();
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
  }, [selectedMedia, allMedia]);

  if (news === undefined) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f37c1b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news details...</p>
        </div>
      </div>
    );
  }

  if (news === null) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c140d] mb-4">News Article Not Found</h1>
          <p className="text-gray-600 mb-6">The news article you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/news"
            className="inline-flex items-center px-4 py-2 bg-[#f37c1b] text-white rounded-lg hover:bg-[#ff9d4d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </div>
      </div>
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
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/news"
              className="inline-flex items-center text-[#f37c1b] hover:text-[#ff9d4d] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to News
            </Link>
            <div className="flex items-center gap-2">
              <Badge className={`${getCategoryColor(news.category)} border`}>
                {news.category}
              </Badge>
              {news.institution && (
                <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                  {news.institution}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            {news.images && news.images.length > 0 && (
              <div 
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
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
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {news.title}
                  </h1>
                  <p className="text-white/90 text-lg">
                    {news.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Article Content */}
            <Card>
              <CardContent className="p-6">
                {!news.images?.length && (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1c140d] mb-4">
                      {news.title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                      {news.summary}
                    </p>
                  </>
                )}
                
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-xl font-semibold text-[#1c140d] mb-4">Article Details</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {news.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Gallery - Combined Images and Videos */}
            {((news.images && news.images.length > 1) || (news.videos && news.videos.length > 0)) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-[#1c140d] mb-4">Media Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Additional Images */}
                    {news.images && news.images.slice(1).map((image, index) => (
                      <div 
                        key={`image-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
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
                    
                    {/* Videos */}
                    {news.videos && news.videos.map((video, index) => (
                      <div 
                        key={`video-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openMediaModal({ type: 'video', url: video, index: (news.images?.length || 0) + index })}
                      >
                        <video
                          src={video}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                            <Play className="w-6 h-6 text-[#f37c1b] ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-[#1c140d] mb-4">Article Information</h2>
                <div className="space-y-4">
                  {/* Published Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Published</p>
                      <p className="text-gray-600">
                        {new Date(news.publishedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Event Date</p>
                      <p className="text-gray-600">
                        {new Date(news.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* End Date */}
                  {news.endDate && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">End Date</p>
                        <p className="text-gray-600">
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

                  {/* Updated Date */}
                  {news.updatedAt && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-gray-600">
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
            </Card>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[#1c140d] mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Actions */}
            <Card className="bg-gradient-to-br from-[#f37c1b]/5 to-[#ff9d4d]/5 border-[#f37c1b]/20">
              <CardContent className="p-6 text-center">
                <h2 className="text-lg font-semibold text-[#1c140d] mb-2">Stay Updated</h2>
                <p className="text-gray-600 mb-4">Get the latest news and updates from our programs.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link 
                    href="/news"
                    className="inline-flex items-center justify-center px-4 py-2 bg-[#f37c1b] text-white rounded-lg hover:bg-[#ff9d4d] transition-colors"
                  >
                    More News
                  </Link>
                  <Link 
                    href="/programs"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#f37c1b] border border-[#f37c1b] rounded-lg hover:bg-[#f37c1b]/5 transition-colors"
                  >
                    Our Programs
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
            {allMedia.length > 1 && (
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
            <div className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              {selectedMedia.type === 'image' ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedMedia.url}
                    alt={`${news.title} - Media`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <VideoPlayer
                    src={selectedMedia.url}
                    className="max-w-full max-h-full"
                    controls={true}
                    autoPlay={true}
                  />
                </div>
              )}
            </div>

            {/* Media Counter */}
            {allMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {allMedia.findIndex(item => item.type === selectedMedia.type && item.url === selectedMedia.url) + 1} / {allMedia.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 