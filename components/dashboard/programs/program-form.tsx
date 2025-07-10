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
import { UploadButton } from "@/utils/uploadthing";
import { Checkbox } from "@/components/ui/checkbox";
import { Doc } from "@/convex/_generated/dataModel";

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
        images: initialData.images,
        status: initialData.status,
        isFeatured: initialData.isFeatured,
        approved: initialData.approved,
      });
    }
  }, [initialData]);

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
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto p-4">
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Images</Label>
        <div className="col-span-3">
          <UploadButton
            className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
            endpoint="programMediaUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                const urls = res.map(r => r.url);
                setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
                toast({ title: "Upload complete" });
              }
            }}
            onUploadError={(error: Error) => toast({ title: "Upload failed", description: error.message, variant: "destructive" })}
          />
           <div className="mt-2 space-y-2">
            {formData.images.map((url, index) => (
              <div key={index} className="text-xs text-muted-foreground truncate">
                Image {index + 1}: {url}
              </div>
            ))}
          </div>
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