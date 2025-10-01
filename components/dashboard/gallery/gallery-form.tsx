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
import { X, Video } from "lucide-react";

const categories = [
  "Maternal Health", "Education", "Mental Health", "Clinical Services", 
  "Laboratory", "Facilities", "Community Outreach", "Youth Services", 
  "Nursing", "Environmental Health", "Training"
];

interface GalleryFormProps {
  setOpen: (open: boolean) => void;
  initialData?: Doc<"gallery">;
}

export function GalleryForm({ setOpen, initialData }: GalleryFormProps) {
  const { toast } = useToast();
  const createGalleryItem = useMutation(api.gallery.createGalleryItem);
  const updateGalleryItem = useMutation(api.gallery.updateGalleryItem);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image" as "image" | "video",
    url: "",
    category: categories[0],
    isPublished: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "image",
        url: initialData.url || "",
        category: initialData.category || categories[0],
        isPublished: initialData.isPublished || false,
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      if (!formData.title.trim() || !formData.url.trim()) {
        toast({
          title: "Error",
          description: "Title and media URL are required.",
          variant: "destructive",
        });
        return;
      }
      
      if (initialData) {
        await updateGalleryItem({
          id: initialData._id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          url: formData.url,
          category: formData.category as any,
          isPublished: formData.isPublished,
        });
        toast({ title: "Success", description: "Gallery item updated." });
      } else {
        await createGalleryItem({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          url: formData.url,
          category: formData.category as any,
          isPublished: formData.isPublished,
        });
        toast({ title: "Success", description: "Gallery item created." });
      }

      setOpen(false);
    } catch (error) {
      toast({
        title: `Error ${initialData ? 'updating' : 'creating'} item`,
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveMedia = () => {
    setFormData(prev => ({ ...prev, url: "", type: "image" }));
  };
  
  return (
    <div className="grid gap-4 py-4 p-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <Label>Media</Label>
        {formData.url ? (
          <div className="relative group w-full h-64">
            {formData.type === 'image' ? (
              <Image
                src={formData.url}
                alt={formData.title}
                fill
                className="object-contain rounded-md border"
              />
            ) : (
              <video
                src={formData.url}
                controls
                className="w-full h-full object-contain rounded-md border bg-black"
              />
            )}
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveMedia}
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove media</span>
            </Button>
          </div>
        ) : (
          <UploadDropzone
            endpoint="galleryMediaUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                const fileType = res[0].type.startsWith('image/') ? 'image' : 'video';
                setFormData(prev => ({ ...prev, url: res[0].url, type: fileType }));
                toast({ title: "Upload complete" });
              }
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
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isPublished" className="text-right">
          Publish
        </Label>
        <Checkbox
          id="isPublished"
          checked={formData.isPublished}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: !!checked }))}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create"}</Button>
      </div>
    </div>
  );
}