"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Doc } from "@/convex/_generated/dataModel";
import { MediaUpload } from "@/components/ui/media-upload";

const STATUS_OPTIONS = ["upcoming", "ongoing", "completed"];

interface ProgramFormProps {
  setOpen: (open: boolean) => void;
  initialData?: Doc<"programs">;
}

interface UploadedFile {
  url: string;
  type: string;
  name: string;
  uploadedBy: string;
}

export function ProgramForm({ setOpen, initialData }: ProgramFormProps) {
  const { toast } = useToast();
  const createProgram = useMutation(api.programs.createProgram);
  const updateProgram = useMutation(api.programs.updateProgram);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    location: "",
    images: [] as string[],
    videos: [] as string[],
    status: STATUS_OPTIONS[0],
    isFeatured: false,
    approved: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        goal: initialData.goal || "",
        location: initialData.location || "",
        images: initialData.images || [],
        videos: initialData.videos || [],
        status: initialData.status,
        isFeatured: initialData.isFeatured,
        approved: initialData.approved,
      });

      // Convert existing media to UploadedFile format for display
      const existingFiles: UploadedFile[] = [];
      initialData.images?.forEach((url, index) => {
        existingFiles.push({
          url,
          type: 'image/jpeg', // Default type for existing images
          name: `Image ${index + 1}`,
          uploadedBy: 'system'
        });
      });
      initialData.videos?.forEach((url, index) => {
        existingFiles.push({
          url,
          type: 'video/mp4', // Default type for existing videos
          name: `Video ${index + 1}`,
          uploadedBy: 'system'
        });
      });
      setUploadedFiles(existingFiles);
    }
  }, [initialData]);

  const handleUploadComplete = (files: UploadedFile[]) => {
    const newImages: string[] = [];
    const newVideos: string[] = [];

    files.forEach((file) => {
      if (file.url && file.type) {
        if (file.type.startsWith('image/')) {
          newImages.push(file.url);
        } else if (file.type.startsWith('video/')) {
          newVideos.push(file.url);
        }
      }
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
      videos: [...prev.videos, ...newVideos],
    }));

    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (urlToRemove: string) => {
    // Remove from form data
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove),
      videos: prev.videos.filter(url => url !== urlToRemove),
    }));
    
    // Remove from uploaded files display
    setUploadedFiles(prev => prev.filter(file => file.url !== urlToRemove));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        toast({ title: "Error", description: "Program name is required.", variant: "destructive" });
        return;
      }
      
      const programData = {
        name: formData.name,
        description: formData.description,
        goal: formData.goal,
        location: formData.location,
        images: formData.images,
        videos: formData.videos,
        status: formData.status,
        isFeatured: formData.isFeatured,
        approved: formData.approved,
        startDate: Date.now(),
        createdAt: Date.now()
      };

      if (initialData) {
        await updateProgram({ id: initialData._id, ...programData });
        toast({ title: "Success", description: "Program updated." });
      } else {
        await createProgram({ ...programData });
        toast({ title: "Success", description: "Program created." });
      }

      setOpen(false);
    } catch (error) {
      toast({ title: `Error ${initialData ? 'updating' : 'creating'} program`, description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="grid gap-4 py-4 p-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="goal" className="text-right">Goal</Label>
        <Input id="goal" value={formData.goal} onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">Location</Label>
        <Input id="location" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
          <SelectContent>{STATUS_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      
      {/* Media Upload Section */}
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">Media</Label>
        <div className="col-span-3">
          <MediaUpload
            endpoint="programMediaUploader"
            onUploadComplete={handleUploadComplete}
            onRemoveFile={handleRemoveFile}
            uploadedFiles={uploadedFiles}
            maxImages={10}
            maxVideos={5}
            maxFileSize="16MB"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isFeatured" className="text-right">Feature</Label>
        <Checkbox id="isFeatured" checked={formData.isFeatured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: !!checked }))} />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="approved" className="text-right">Approve</Label>
        <Checkbox id="approved" checked={formData.approved} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, approved: !!checked }))} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create"}</Button>
      </div>
    </div>
  );
} 