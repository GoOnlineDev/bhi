"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  Users, 
  Camera, 
  FileText, 
  HeartPulse, 
  Eye, 
  Plus,
  ArrowUpRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const galleryStats = useQuery(api.gallery.getGalleryStats);
  const publishedNews = useQuery(api.news.getPublishedNews);
  const unpublishedNews = useQuery(api.news.getUnpublishedNews);
  const approvedPrograms = useQuery(api.programs.getApprovedPrograms);
  const unapprovedPrograms = useQuery(api.programs.getUnapprovedPrograms);

  const totalNews = (publishedNews?.length || 0) + (unpublishedNews?.length || 0);
  const totalPrograms = (approvedPrograms?.length || 0) + (unapprovedPrograms?.length || 0);
  
  const isLoading = 
    currentUser === undefined ||
    galleryStats === undefined ||
    publishedNews === undefined ||
    unpublishedNews === undefined ||
    approvedPrograms === undefined ||
    unapprovedPrograms === undefined;

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      
      {/* Welcome & Role */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Welcome back{currentUser?.firstName ? `, ${currentUser.firstName}` : ''}!
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {currentUser?.role?.toUpperCase() || 'USER'}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {currentUser?.role === 'admin' || currentUser?.role === 'superadmin' 
              ? 'You have full access to manage all content and settings.' 
              : currentUser?.role === 'editor' 
              ? 'You can create and edit content. Submissions require approval.' 
              : 'Here is an overview of the platform.'
            }
          </p>
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{galleryStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {galleryStats?.videos || 0} videos, {galleryStats?.images || 0} images
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNews}</div>
            <p className="text-xs text-muted-foreground">
              {publishedNews?.length || 0} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrograms}</div>
            <p className="text-xs text-muted-foreground">
              {approvedPrograms?.length || 0} approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(unpublishedNews?.length || 0) + (unapprovedPrograms?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Items needing approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Quickly jump to common tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/dashboard/gallery">
              <Button className="w-full">
                <Camera className="mr-2 h-4 w-4" /> Manage Gallery
              </Button>
            </Link>
            <Link href="/dashboard/news">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" /> Manage News
              </Button>
            </Link>
            <Link href="/dashboard/programs">
              <Button className="w-full">
                <HeartPulse className="mr-2 h-4 w-4" /> Manage Programs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Unpublished Content</CardTitle>
            <CardDescription>
              Content you have recently created that is unpublished.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unpublishedNews?.slice(0, 2).map(news => (
                <div key={news._id} className="flex items-center">
                  <FileText className="h-5 w-5 mr-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none truncate">{news.title}</p>
                    <p className="text-xs text-muted-foreground">
                      News Article • {new Date(news._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/dashboard/news`}>
                    <Button variant="outline" size="sm" className="ml-auto">
                      View
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
              {unapprovedPrograms?.slice(0, 2).map(program => (
                <div key={program._id} className="flex items-center">
                  <HeartPulse className="h-5 w-5 mr-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none truncate">{program.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Program • {new Date(program._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                   <Link href={`/dashboard/programs`}>
                    <Button variant="outline" size="sm" className="ml-auto">
                      View
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
              {(unpublishedNews?.length === 0 && unapprovedPrograms?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent unpublished content.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      
      {/* Welcome & Role Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      
      {/* Quick Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/4" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-4" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
             <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-4" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
