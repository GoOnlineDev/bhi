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
import { ProgramsList } from "@/components/dashboard/programs/programs-list";
import { ProgramsSkeleton } from "@/components/dashboard/programs/programs-skeleton";
import { ProgramForm } from "@/components/dashboard/programs/program-form";

export default function DashboardProgramsPage() {
  const allPrograms = useQuery(api.programs.getAllPrograms);
  const isLoading = allPrograms === undefined;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return <ProgramsSkeleton />;
  }

  const approved = allPrograms?.filter(item => item.approved) || [];
  const drafts = allPrograms?.filter(item => !item.approved) || [];

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Program
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
              <DialogHeader>
                <DialogTitle>Add Program</DialogTitle>
                <DialogDescription>
                  Fill out the form to create a new program.
                </DialogDescription>
              </DialogHeader>
              <ProgramForm setOpen={setIsCreateModalOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Programs</CardTitle>
            <CardDescription>
              Manage all your programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgramsList items={allPrograms || []} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="approved">
        <Card>
          <CardHeader>
            <CardTitle>Approved Programs</CardTitle>
            <CardDescription>
              Programs currently active and visible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgramsList items={approved} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="drafts">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
            <CardDescription>
              Programs that are not yet approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgramsList items={drafts} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
