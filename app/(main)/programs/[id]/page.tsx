"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import VideoPlayer from "@/components/ui/video-player";
import { Calendar, MapPin, User, Phone, Mail, ArrowLeft, Clock, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type MediaItem = {
  type: 'image' | 'video';
  url: string;
  index: number;
};

export default function ProgramDetailsPage() {
  const params = useParams();
  const router = useRouter();
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
  }, [selectedMedia, allMedia]);

  if (program === undefined) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f37c1b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (program === null) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c140d] mb-4">Program Not Found</h1>
          <p className="text-gray-600 mb-6">The program you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/programs"
            className="inline-flex items-center px-4 py-2 bg-[#f37c1b] text-white rounded-lg hover:bg-[#ff9d4d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </Link>
        </div>
      </div>
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
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/programs"
              className="inline-flex items-center text-[#f37c1b] hover:text-[#ff9d4d] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Programs
            </Link>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(program.status)} border`}>
                {program.status}
              </Badge>
              {program.isFeatured && (
                <Badge className="bg-[#f37c1b]/10 text-[#f37c1b] border border-[#f37c1b]/20">
                  Featured
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
            {program.images && program.images.length > 0 && (
              <div 
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
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
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {program.name}
                  </h1>
                  {program.location && (
                    <div className="flex items-center text-white/90">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{program.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Program Details */}
            <Card>
              <CardContent className="p-6">
                {!program.images?.length && (
                  <h1 className="text-3xl md:text-4xl font-bold text-[#1c140d] mb-6">
                    {program.name}
                  </h1>
                )}
                
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-xl font-semibold text-[#1c140d] mb-4">About This Program</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {program.description}
                  </p>
                </div>

                {program.goal && (
                  <div className="mt-6 p-4 bg-[#f37c1b]/5 rounded-lg border border-[#f37c1b]/10">
                    <h3 className="font-semibold text-[#f37c1b] mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Program Goal
                    </h3>
                    <p className="text-gray-700">{program.goal}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media Gallery - Combined Images and Videos */}
            {((program.images && program.images.length > 1) || (program.videos && program.videos.length > 0)) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-[#1c140d] mb-4">Media Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Additional Images */}
                    {program.images && program.images.slice(1).map((image, index) => (
                      <div 
                        key={`image-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
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
                    
                    {/* Videos */}
                    {program.videos && program.videos.map((video, index) => (
                      <div 
                        key={`video-${index}`} 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openMediaModal({ type: 'video', url: video, index: (program.images?.length || 0) + index })}
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
            {/* Program Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-[#1c140d] mb-4">Program Information</h2>
                <div className="space-y-4">
                  {/* Start Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Start Date</p>
                      <p className="text-gray-600">
                        {new Date(program.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(program.startDate), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* End Date */}
                  {program.endDate && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">End Date</p>
                        <p className="text-gray-600">
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

                  {/* Location */}
                  {program.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">{program.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {(program.contactPerson || program.contactEmail || program.contactPhone) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[#1c140d] mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    {program.contactPerson && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Contact Person</p>
                          <p className="text-gray-600">{program.contactPerson}</p>
                        </div>
                      </div>
                    )}

                    {program.contactEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <a 
                            href={`mailto:${program.contactEmail}`}
                            className="text-[#f37c1b] hover:text-[#ff9d4d] transition-colors"
                          >
                            {program.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    {program.contactPhone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-[#f37c1b] mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <a 
                            href={`tel:${program.contactPhone}`}
                            className="text-[#f37c1b] hover:text-[#ff9d4d] transition-colors"
                          >
                            {program.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {program.tags && program.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[#1c140d] mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {program.tags.map((tag, index) => (
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

            {/* Call to Action */}
            <Card className="bg-gradient-to-br from-[#f37c1b]/5 to-[#ff9d4d]/5 border-[#f37c1b]/20">
              <CardContent className="p-6 text-center">
                <h2 className="text-lg font-semibold text-[#1c140d] mb-2">Interested in This Program?</h2>
                <p className="text-gray-600 mb-4">Get in touch to learn more or participate.</p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 bg-[#f37c1b] text-white rounded-lg hover:bg-[#ff9d4d] transition-colors"
                >
                  Contact Us
                </Link>
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
                    alt={`${program.name} - Media`}
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