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
import { UploadDropzone } from "@/utils/uploadthing";
import { Checkbox } from "@/components/ui/checkbox";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["upcoming", "ongoing", "completed"];

interface ProgramFormProps {
  setOpen: (open: boolean) => void;
  initialData?: Doc<"programs">;
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
    }
  }, [initialData]);

  const handleMediaUpload = (res: { url: string; type: string }[]) => {
    const newImages = res.filter(r => r.type.startsWith('image/')).map(r => r.url);
    const newVideos = res.filter(r => r.type.startsWith('video/')).map(r => r.url);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
      videos: [...prev.videos, ...newVideos],
    }));
    toast({ title: "Upload complete" });
  };

  const handleRemoveMedia = (urlToRemove: string, type: 'image' | 'video') => {
    if (type === 'image') {
      setFormData(prev => ({ ...prev, images: prev.images.filter(url => url !== urlToRemove) }));
    } else {
      setFormData(prev => ({ ...prev, videos: prev.videos.filter(url => url !== urlToRemove) }));
    }
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
      <div className="grid grid-cols-1 gap-2">
        <Label>Media</Label>
        <UploadDropzone
          endpoint="programMediaUploader"
          onClientUploadComplete={(res) => {
            if (res) handleMediaUpload(res);
          }}
          onUploadError={(error: Error) => {
            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
          }}
          className="ut-label:text-primary ut-upload-icon:text-primary/80 ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
        />
        {(formData.images.length > 0 || formData.videos.length > 0) && (
          <div className="mt-4 space-y-4">
            <h4 className="font-medium">Uploaded Media</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((url) => (
                <div key={url} className="relative group aspect-square">
                  <Image src={url} alt="Uploaded image" fill className="object-cover rounded-md border" />
                  <Button variant="destructive" size="icon" onClick={() => handleRemoveMedia(url, 'image')} className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.videos.map((url) => (
                <div key={url} className="relative group aspect-square">
                  <video src={url} controls className="w-full h-full object-cover rounded-md border bg-black" />
                  <Button variant="destructive" size="icon" onClick={() => handleRemoveMedia(url, 'video')} className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
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