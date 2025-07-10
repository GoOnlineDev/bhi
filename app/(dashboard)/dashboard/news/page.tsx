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
import { NewsList } from "@/components/dashboard/news/news-list";
import { NewsSkeleton } from "@/components/dashboard/news/news-skeleton";
import { NewsForm } from "@/components/dashboard/news/news-form";

export default function DashboardNewsPage() {
  const allNews = useQuery(api.news.getAllNews);
  const isLoading = allNews === undefined;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return <NewsSkeleton />;
  }

  const published = allNews?.filter(item => item.isPublished) || [];
  const drafts = allNews?.filter(item => !item.isPublished) || [];

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
                  Add News
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
              <DialogHeader>
                <DialogTitle>Add News Article</DialogTitle>
                <DialogDescription>
                  Fill out the form to create a new news article.
                </DialogDescription>
              </DialogHeader>
              <NewsForm setOpen={setIsCreateModalOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All News Articles</CardTitle>
            <CardDescription>
              Manage all your news articles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewsList items={allNews || []} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="published">
        <Card>
          <CardHeader>
            <CardTitle>Published Articles</CardTitle>
            <CardDescription>
              Articles currently visible on your public site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewsList items={published} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="drafts">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
            <CardDescription>
              Articles that are not yet published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewsList items={drafts} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
