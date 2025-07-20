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

const CATEGORY_OPTIONS = [
  "Announcements", "Health Tips", "Community Programs", "Medical Updates",
  "Staff Highlights", "Success Stories", "Event Recaps", "Policy Changes",
  "Emergency Alerts", "Research & Innovation"
];

interface NewsFormProps {
  setOpen: (open: boolean) => void;
  initialData?: Doc<"news">;
}

export function NewsForm({ setOpen, initialData }: NewsFormProps) {
  const { toast } = useToast();
  const createNews = useMutation(api.news.createNews);
  const updateNews = useMutation(api.news.updateNews);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    images: [] as string[],
    videos: [] as string[],
    category: CATEGORY_OPTIONS[0],
    isPublished: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        summary: initialData.summary,
        images: initialData.images || [],
        videos: initialData.videos || [],
        category: initialData.category,
        isPublished: initialData.isPublished,
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
      if (!formData.title.trim()) {
        toast({
          title: "Error",
          description: "Title is required.",
          variant: "destructive",
        });
        return;
      }
      
      const newsData = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        images: formData.images,
        videos: formData.videos,
        category: formData.category as any,
        isPublished: formData.isPublished,
      };

      if (initialData) {
        await updateNews({ id: initialData._id, ...newsData });
        toast({ title: "Success", description: "News article updated." });
      } else {
        await createNews({ 
          ...newsData,
          startDate: Date.now(),
          publishedAt: Date.now(),
        });
        toast({ title: "Success", description: "News article created." });
      }

      setOpen(false);
    } catch (error) {
      toast({
        title: `Error ${initialData ? 'updating' : 'creating'} article`,
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="grid gap-4 py-4 p-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Title</Label>
        <Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="summary" className="text-right">Summary</Label>
        <Textarea id="summary" value={formData.summary} onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="content" className="text-right">Content</Label>
        <Textarea id="content" value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} className="col-span-3" rows={5} />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORY_OPTIONS.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Label>Media</Label>
        <UploadDropzone
          endpoint="newsMediaUploader"
          onClientUploadComplete={(res) => {
            if (res) handleMediaUpload(res);
          }}
          onUploadError={(error: Error) => {
            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
          }}
          className="ut-label:text-primary ut-upload-icon:text-primary/80 ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
          appearance={
            {
              button: "bg-orange-600 text-white px-4 py-2 rounded hover:bg-blue-700",
              label: "text-sm text-gray-600",
              container: "flex flex-col items-center space-y-4",
            }
          }          
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
        <Label htmlFor="isPublished" className="text-right">Publish</Label>
        <Checkbox id="isPublished" checked={formData.isPublished} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: !!checked }))} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create"}</Button>
      </div>
    </div>
  );
}