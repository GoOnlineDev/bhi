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
import { ServicesList } from "@/components/dashboard/services/services-list";
import { ServicesSkeleton } from "@/components/dashboard/services/services-skeleton";
import { ServiceForm } from "@/components/dashboard/services/service-form";

export default function DashboardServicesPage() {
  const allServices = useQuery(api.services.getAllServices);
  const isLoading = allServices === undefined;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return <ServicesSkeleton />;
  }

  const published = allServices?.filter(item => item.isPublished) || [];
  const drafts = allServices?.filter(item => !item.isPublished) || [];

  return (
    <Tabs defaultValue="all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <TabsList>
          <TabsTrigger value="all">All ({allServices?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="published">Published ({published.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Service
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
              <DialogHeader>
                <DialogTitle>Add Service</DialogTitle>
                <DialogDescription>
                  Fill out the form to create a new service. Add a title, description, features,
                  benefits, process steps, and upload images.
                </DialogDescription>
              </DialogHeader>
              <ServiceForm setOpen={setIsCreateModalOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Services</CardTitle>
            <CardDescription>
              Manage all services — including unpublished drafts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServicesList items={allServices || []} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="published">
        <Card>
          <CardHeader>
            <CardTitle>Published Services</CardTitle>
            <CardDescription>
              Services currently visible on the public website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServicesList items={published} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="drafts">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
            <CardDescription>
              Services not yet published — only visible in the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServicesList items={drafts} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
