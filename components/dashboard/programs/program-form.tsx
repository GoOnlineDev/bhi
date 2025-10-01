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
import { Calendar, MapPin, Phone, Mail, User, Tag, X } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";

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
    startDate: new Date().getTime(),
    endDate: undefined as number | undefined,
    location: "",
    images: [] as string[],
    videos: [] as string[],
    status: STATUS_OPTIONS[0],
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    tags: [] as string[],
    isFeatured: false,
    approved: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        goal: initialData.goal || "",
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        location: initialData.location || "",
        images: initialData.images || [],
        videos: initialData.videos || [],
        status: initialData.status,
        contactPerson: initialData.contactPerson || "",
        contactPhone: initialData.contactPhone || "",
        contactEmail: initialData.contactEmail || "",
        tags: initialData.tags || [],
        isFeatured: initialData.isFeatured,
        approved: initialData.approved,
      });

      // Convert existing media to UploadedFile format for display
      const existingFiles: UploadedFile[] = [];
      initialData.images?.forEach((url, index) => {
        existingFiles.push({
          url,
          type: 'image/jpeg',
          name: `Image ${index + 1}`,
          uploadedBy: 'system'
        });
      });
      initialData.videos?.forEach((url, index) => {
        existingFiles.push({
          url,
          type: 'video/mp4',
          name: `Video ${index + 1}`,
          uploadedBy: 'system'
        });
      });
      setUploadedFiles(existingFiles);
      
      // Set tags input for display
      setTagsInput(initialData.tags?.join(", ") || "");
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
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove),
      videos: prev.videos.filter(url => url !== urlToRemove),
    }));
    
    setUploadedFiles(prev => prev.filter(file => file.url !== urlToRemove));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        toast({ title: "Error", description: "Program name is required.", variant: "destructive" });
        return;
      }
      
      if (!formData.description.trim()) {
        toast({ title: "Error", description: "Program description is required.", variant: "destructive" });
        return;
      }

      if (!formData.startDate) {
        toast({ title: "Error", description: "Start date is required.", variant: "destructive" });
        return;
      }

      if (initialData) {
        // For updates, only send fields that have changed
        const updateData: any = { id: initialData._id };
        
        // Compare each field with the original data
        if (formData.name.trim() !== initialData.name) {
          updateData.name = formData.name.trim();
        }
        if (formData.description.trim() !== initialData.description) {
          updateData.description = formData.description.trim();
        }
        if (formData.goal.trim() !== (initialData.goal || "")) {
          updateData.goal = formData.goal.trim();
        }
        if (formData.startDate !== initialData.startDate) {
          updateData.startDate = formData.startDate;
        }
        if (formData.endDate !== initialData.endDate) {
          updateData.endDate = formData.endDate;
        }
        if (formData.location.trim() !== (initialData.location || "")) {
          updateData.location = formData.location.trim();
        }
        if (JSON.stringify(formData.images) !== JSON.stringify(initialData.images || [])) {
          updateData.images = formData.images;
        }
        if (JSON.stringify(formData.videos) !== JSON.stringify(initialData.videos || [])) {
          updateData.videos = formData.videos;
        }
        if (formData.status !== initialData.status) {
          updateData.status = formData.status;
        }
        if (formData.contactPerson.trim() !== (initialData.contactPerson || "")) {
          updateData.contactPerson = formData.contactPerson.trim();
        }
        if (formData.contactPhone.trim() !== (initialData.contactPhone || "")) {
          updateData.contactPhone = formData.contactPhone.trim();
        }
        if (formData.contactEmail.trim() !== (initialData.contactEmail || "")) {
          updateData.contactEmail = formData.contactEmail.trim();
        }
        if (JSON.stringify(formData.tags) !== JSON.stringify(initialData.tags || [])) {
          updateData.tags = formData.tags;
        }
        if (formData.isFeatured !== initialData.isFeatured) {
          updateData.isFeatured = formData.isFeatured;
        }
        if (formData.approved !== initialData.approved) {
          updateData.approved = formData.approved;
        }
        
        // Always include updatedAt
        updateData.updatedAt = Date.now();

        console.log("Updating program with data:", updateData);
        
        await updateProgram(updateData);
        toast({ title: "Success", description: "Program updated successfully." });
      } else {
        // For new programs, send all required data
        const programData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          goal: formData.goal.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location.trim(),
          images: formData.images,
          videos: formData.videos,
          status: formData.status,
          contactPerson: formData.contactPerson.trim(),
          contactPhone: formData.contactPhone.trim(),
          contactEmail: formData.contactEmail.trim(),
          tags: formData.tags,
          isFeatured: formData.isFeatured,
          approved: formData.approved,
          createdAt: Date.now()
        };

        console.log("Creating program with data:", programData);
        
        await createProgram(programData);
        toast({ title: "Success", description: "Program created successfully." });
      }

      setOpen(false);
    } catch (error) {
      console.error("Program operation failed:", error);
      toast({ 
        title: `Error ${initialData ? 'updating' : 'creating'} program`, 
        description: (error as Error).message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="grid gap-6 py-4 p-4 max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name *</Label>
          <Input 
            id="name" 
            value={formData.name} 
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
            className="col-span-3" 
            placeholder="Enter program name"
          />
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">Description *</Label>
          <Textarea 
            id="description" 
            value={formData.description} 
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
            className="col-span-3" 
            placeholder="Describe the program"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="goal" className="text-right pt-2">Goal</Label>
          <Textarea 
            id="goal" 
            value={formData.goal} 
            onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))} 
            className="col-span-3" 
            placeholder="Program objectives and goals"
            rows={3}
          />
        </div>
      </div>

      {/* Dates and Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Schedule & Location</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">Start Date *</Label>
          <Input 
            id="startDate" 
            type="datetime-local" 
            value={new Date(formData.startDate).toISOString().slice(0, 16)}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value).getTime() }))} 
            className="col-span-3" 
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endDate" className="text-right">End Date</Label>
          <Input 
            id="endDate" 
            type="datetime-local" 
            value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              endDate: e.target.value ? new Date(e.target.value).getTime() : undefined 
            }))} 
            className="col-span-3" 
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">Location</Label>
          <Input 
            id="location" 
            value={formData.location} 
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} 
            className="col-span-3" 
            placeholder="Program location"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="contactPerson" className="text-right">Contact Person</Label>
          <Input 
            id="contactPerson" 
            value={formData.contactPerson} 
            onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))} 
            className="col-span-3" 
            placeholder="Primary contact person"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="contactPhone" className="text-right">Phone</Label>
          <Input 
            id="contactPhone" 
            value={formData.contactPhone} 
            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))} 
            className="col-span-3" 
            placeholder="Contact phone number"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="contactEmail" className="text-right">Email</Label>
          <Input 
            id="contactEmail" 
            type="email"
            value={formData.contactEmail} 
            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))} 
            className="col-span-3" 
            placeholder="Contact email address"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tags</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tags" className="text-right">Tags</Label>
          <Input 
            id="tags" 
            value={tagsInput} 
            onChange={(e) => handleTagsChange(e.target.value)} 
            className="col-span-3" 
            placeholder="Enter tags separated by commas"
          />
        </div>
      </div>
      
      {/* Media Upload Section */}
      <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        <Label>Media</Label>
        <UploadDropzone
          endpoint="programMediaUploader"
          onClientUploadComplete={(res: any[]) => {
            if (res) handleUploadComplete(res);
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
                  <Button variant="destructive" size="icon" onClick={() => handleRemoveFile(url)} className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.videos.map((url) => (
                <div key={url} className="relative group aspect-square">
                  <video src={url} controls className="w-full h-full object-cover rounded-md border bg-black" />
                  <Button variant="destructive" size="icon" onClick={() => handleRemoveFile(url)} className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isFeatured" className="text-right">Featured Program</Label>
          <Checkbox 
            id="isFeatured" 
            checked={formData.isFeatured} 
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: !!checked }))} 
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="approved" className="text-right">Approve Program</Label>
          <Checkbox 
            id="approved" 
            checked={formData.approved} 
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, approved: !!checked }))} 
          />
        </div>
      </div>

      {/* Debug Section */}
      <div className="space-y-4">
        
        {showDebug && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div>
              <h4 className="font-medium mb-2">Current Form Data:</h4>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
            
            {initialData && (
              <div>
                <h4 className="font-medium mb-2">Original Data:</h4>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                  {JSON.stringify(initialData, null, 2)}
                </pre>
              </div>
            )}
            
            <div>
              <h4 className="font-medium mb-2">Uploaded Files:</h4>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(uploadedFiles, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? "Save Changes" : "Create Program"}
        </Button>
      </div>
    </div>
  );
} 