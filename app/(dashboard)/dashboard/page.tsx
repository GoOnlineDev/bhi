"use client";

import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { Lock, Shield, Users, Camera, FileText, Calendar, Plus, TrendingUp, Eye, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { Video } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <Authenticated>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Image 
                src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" 
                alt="Logo" 
                width={40} 
                height={40} 
                className="object-contain"
              />
              <h1 className="text-2xl font-bold text-[#1c140d]">Dashboard</h1>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
          <AuthenticatedContent />
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image 
                  src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" 
                  alt="Logo" 
                  width={80} 
                  height={80} 
                  className="object-contain"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1c140d] mb-4">
                Welcome to Boost Health Initiative Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Sign in to access the dashboard and manage content
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-[#f37c1b]/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-[#f37c1b]" />
                  </div>
                  <h3 className="font-semibold text-[#1c140d] mb-2">Secure Access</h3>
                  <p className="text-sm text-gray-600">Protected dashboard with secure authentication</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-[#f37c1b]/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-[#f37c1b]" />
                  </div>
                  <h3 className="font-semibold text-[#1c140d] mb-2">Role-Based Access</h3>
                  <p className="text-sm text-gray-600">Different permissions for different roles</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-[#f37c1b]/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-[#f37c1b]" />
                  </div>
                  <h3 className="font-semibold text-[#1c140d] mb-2">Team Collaboration</h3>
                  <p className="text-sm text-gray-600">Work together to manage content</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SignInButton mode="modal">
                    <button className="flex-1 bg-[#f37c1b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ff9d4d] transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex-1 bg-white border-2 border-[#f37c1b] text-[#f37c1b] px-6 py-3 rounded-lg font-semibold hover:bg-[#f37c1b]/5 transition-colors">
                      Create Account
                    </button>
                  </SignUpButton>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Need help? Contact support at support@boosthealthinitiative.org</p>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}

function AuthenticatedContent() {
  const { toast } = useToast();
  const currentUser = useQuery(api.users.getCurrentUser);
  const galleryStats = useQuery(api.gallery.getGalleryStats);
  const publishedNews = useQuery(api.news.getPublishedNews);
  const unpublishedNews = useQuery(api.news.getUnpublishedNews);
  const approvedPrograms = useQuery(api.programs.getApprovedPrograms);
  const unapprovedPrograms = useQuery(api.programs.getUnapprovedPrograms);

  const totalNews = (publishedNews?.length || 0) + (unpublishedNews?.length || 0);
  const totalPrograms = (approvedPrograms?.length || 0) + (unapprovedPrograms?.length || 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#f37c1b]/5 to-[#ff9d4d]/5 rounded-xl shadow-sm p-6 border border-[#f37c1b]/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#f37c1b]/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-[#f37c1b]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1c140d]">
              Welcome back{currentUser?.firstName ? `, ${currentUser.firstName}` : ''}!
            </h2>
            <p className="text-gray-600">
              {currentUser?.role === 'admin' || currentUser?.role === 'superadmin' 
                ? 'You have admin access to manage all content and approve submissions.' 
                : currentUser?.role === 'editor' 
                ? 'You can create and edit content. Your submissions will be reviewed before publication.' 
                : 'Welcome to the Boost Health Initiative dashboard.'
              }
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-white">
                {currentUser?.role?.toUpperCase() || 'USER'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-[#f37c1b] hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gallery Items</p>
                  <p className="text-2xl font-bold text-[#1c140d]">{galleryStats?.total || 0}</p>
                  <p className="text-xs text-green-600">{galleryStats?.total || 0} total</p>
                </div>
                <Camera className="w-8 h-8 text-[#f37c1b]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">News Articles</p>
                  <p className="text-2xl font-bold text-[#1c140d]">{totalNews}</p>
                  <p className="text-xs text-green-600">{publishedNews?.length || 0} published</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Programs</p>
                  <p className="text-2xl font-bold text-[#1c140d]">{totalPrograms}</p>
                  <p className="text-xs text-green-600">{approvedPrograms?.length || 0} approved</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Published</p>
                  <p className="text-2xl font-bold text-[#1c140d]">
                    {(galleryStats?.total || 0) + (publishedNews?.length || 0) + (approvedPrograms?.length || 0)}
                  </p>
                  <p className="text-xs text-purple-600">Live content</p>
                </div>
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
    <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-[#1c140d] mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/gallery">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border hover:border-[#f37c1b]/30">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-[#f37c1b]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Camera className="w-7 h-7 text-[#f37c1b]" />
                </div>
                <h4 className="font-semibold text-[#1c140d] mb-2">Manage Gallery</h4>
                <p className="text-sm text-gray-600 mb-3">Upload and organize photos and videos to showcase your impact</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>{galleryStats?.total || 0} items</span>
                  <span>•</span>
                  <span>{(unpublishedNews?.length || 0)} pending</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/news">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border hover:border-blue-500/30">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-7 h-7 text-blue-500" />
                </div>
                <h4 className="font-semibold text-[#1c140d] mb-2">Create News</h4>
                <p className="text-sm text-gray-600 mb-3">Share updates, announcements, and health tips with your community</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>{totalNews} articles</span>
                  <span>•</span>
                  <span>{unpublishedNews?.length || 0} drafts</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/programs">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border hover:border-green-500/30">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Calendar className="w-7 h-7 text-green-500" />
                </div>
                <h4 className="font-semibold text-[#1c140d] mb-2">Manage Programs</h4>
                <p className="text-sm text-gray-600 mb-3">Create and coordinate health programs and community initiatives</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>{totalPrograms} programs</span>
                  <span>•</span>
                  <span>{unapprovedPrograms?.length || 0} pending</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1c140d]">
              <Edit className="w-5 h-5" />
              Items Pending Review
              {((unpublishedNews?.length || 0) + (unapprovedPrograms?.length || 0)) > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {(unpublishedNews?.length || 0) + (unapprovedPrograms?.length || 0)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(unpublishedNews?.length || 0) > 0 && (
                <Link href="/dashboard/news" className="block">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <div>
                        <span className="text-sm font-medium">Unpublished News</span>
                        <p className="text-xs text-gray-600">Articles awaiting approval</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                      {unpublishedNews?.length}
                    </Badge>
                  </div>
                </Link>
              )}
              
              {(unapprovedPrograms?.length || 0) > 0 && (
                <Link href="/dashboard/programs" className="block">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-yellow-600" />
        <div>
                        <span className="text-sm font-medium">Unapproved Programs</span>
                        <p className="text-xs text-gray-600">Programs awaiting approval</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                      {unapprovedPrograms?.length}
                    </Badge>
                  </div>
                </Link>
              )}

              {(unpublishedNews?.length || 0) === 0 && 
               (unapprovedPrograms?.length || 0) === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm">No items pending review.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1c140d]">
              <Plus className="w-5 h-5" />
              Quick Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">Upload media files for use in news articles and programs</p>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-200">
          <UploadButton
            endpoint="imageUploader"
                  appearance={{
                    button: {
                      background: "linear-gradient(135deg, #f37c1b, #ff9d4d)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "14px 28px",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(243, 124, 27, 0.3)",
                      transition: "all 0.2s ease",
                      width: "100%"
                    },
                    container: {
                      width: "100%"
                    },
                    allowedContent: {
                      color: "#6b7280",
                      fontSize: "12px",
                      marginTop: "8px",
                      textAlign: "center"
                    }
                  }}
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
                    toast({
                      title: "Upload Successful!",
                      description: `${res.length} file(s) uploaded successfully`,
                    });
            }}
            onUploadError={(error: Error) => {
                    toast({
                      title: "Upload Failed",
                      description: error.message,
                      variant: "destructive",
                    });
                  }}
                />
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>Images</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>Videos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Documents</span>
                    </div>
                  </div>
                </div>
              </div>
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
