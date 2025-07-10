"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryList } from "@/components/dashboard/gallery/gallery-list";
import { GallerySkeleton } from "@/components/dashboard/gallery/gallery-skeleton";
import { GalleryForm } from "@/components/dashboard/gallery/gallery-form";

export default function DashboardGalleryPage() {
  const allGalleryItems = useQuery(api.gallery.getAllGalleryItems);
  const isLoading = allGalleryItems === undefined;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return <GallerySkeleton />;
  }

  const published = allGalleryItems?.filter(item => item.isPublished) || [];
  const drafts = allGalleryItems?.filter(item => !item.isPublished) || [];

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Media
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Media</DialogTitle>
                <DialogDescription>
                  Upload new images or videos to your gallery.
                </DialogDescription>
              </DialogHeader>
              <GalleryForm setOpen={setIsCreateModalOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Media</CardTitle>
            <CardDescription>
              Manage all your gallery media.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GalleryList items={allGalleryItems || []} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="published">
        <Card>
          <CardHeader>
            <CardTitle>Published Media</CardTitle>
            <CardDescription>
              Media that is currently visible on your public gallery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GalleryList items={published} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="drafts">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
            <CardDescription>
              Media that is not yet published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GalleryList items={drafts} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 