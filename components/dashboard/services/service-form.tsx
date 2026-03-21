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
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { X, Plus, Trash2 } from "lucide-react";

export const SERVICE_CATEGORIES = [
  "SRHR",
  "NCDs",
  "GBV",
  "Substance Abuse",
  "Maternal & Child Health",
  "Mental Health",
  "Clinical Services",
  "Community Outreach",
  "Environmental Health",
  "Education & Prevention",
  "Youth Services",
  "Nursing Services",
  "Other",
];

interface ServiceFormProps {
  setOpen: (open: boolean) => void;
  initialData?: Doc<"services">;
}

interface UploadedFile {
  url: string;
  type: string;
  name: string;
  uploadedBy: string;
}

type Feature = { title: string; description: string };
type Stat = { label: string; value: string };

export function ServiceForm({ setOpen, initialData }: ServiceFormProps) {
  const { toast } = useToast();
  const createService = useMutation(api.services.createService);
  const updateService = useMutation(api.services.updateService);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortTitle: "",
    description: "",
    overview: "",
    category: "",
    heroImage: "",
    images: [] as string[],
    videos: [] as string[],
    isPublished: false,
    isFeatured: false,
    order: undefined as number | undefined,
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    tags: [] as string[],
  });

  const [features, setFeatures] = useState<Feature[]>([{ title: "", description: "" }]);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [processSteps, setProcessSteps] = useState<string[]>([""]);
  const [stats, setStats] = useState<Stat[]>([{ label: "", value: "" }]);
  const [tagsInput, setTagsInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        slug: initialData.slug || "",
        shortTitle: initialData.shortTitle || "",
        description: initialData.description,
        overview: initialData.overview || "",
        category: initialData.category || "",
        heroImage: initialData.heroImage || "",
        images: initialData.images || [],
        videos: initialData.videos || [],
        isPublished: initialData.isPublished,
        isFeatured: initialData.isFeatured ?? false,
        order: initialData.order,
        contactPerson: initialData.contactPerson || "",
        contactPhone: initialData.contactPhone || "",
        contactEmail: initialData.contactEmail || "",
        tags: initialData.tags || [],
      });
      setFeatures(initialData.features?.length ? initialData.features : [{ title: "", description: "" }]);
      setBenefits(initialData.benefits?.length ? initialData.benefits : [""]);
      setProcessSteps(initialData.process?.length ? initialData.process : [""]);
      setStats(initialData.stats?.length ? initialData.stats : [{ label: "", value: "" }]);
      setTagsInput(initialData.tags?.join(", ") || "");

      const existingFiles: UploadedFile[] = [
        ...(initialData.images || []).map((url, i) => ({ url, type: "image/jpeg", name: `Image ${i + 1}`, uploadedBy: "system" })),
        ...(initialData.videos || []).map((url, i) => ({ url, type: "video/mp4", name: `Video ${i + 1}`, uploadedBy: "system" })),
      ];
      setUploadedFiles(existingFiles);
    }
  }, [initialData]);

  const handleUploadComplete = (files: UploadedFile[]) => {
    const newImages: string[] = [];
    const newVideos: string[] = [];
    files.forEach((file) => {
      if (file.url && file.type) {
        if (file.type.startsWith("image/")) newImages.push(file.url);
        else if (file.type.startsWith("video/")) newVideos.push(file.url);
      }
    });
    setFormData(prev => ({
      ...prev,
      heroImage: prev.heroImage || newImages[0] || prev.heroImage,
      images: [...prev.images, ...newImages],
      videos: [...prev.videos, ...newVideos],
    }));
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      heroImage: prev.heroImage === urlToRemove ? "" : prev.heroImage,
      images: prev.images.filter(url => url !== urlToRemove),
      videos: prev.videos.filter(url => url !== urlToRemove),
    }));
    setUploadedFiles(prev => prev.filter(f => f.url !== urlToRemove));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(",").map(t => t.trim()).filter(t => t.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title.trim()) {
        toast({ title: "Error", description: "Service title is required.", variant: "destructive" });
        return;
      }
      if (!formData.description.trim()) {
        toast({ title: "Error", description: "Service description is required.", variant: "destructive" });
        return;
      }

      const cleanFeatures = features.filter(f => f.title.trim() || f.description.trim());
      const cleanBenefits = benefits.filter(b => b.trim());
      const cleanProcess = processSteps.filter(p => p.trim());
      const cleanStats = stats.filter(s => s.label.trim() || s.value.trim());

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        shortTitle: formData.shortTitle.trim() || undefined,
        description: formData.description.trim(),
        overview: formData.overview.trim() || undefined,
        category: formData.category || undefined,
        heroImage: formData.heroImage || undefined,
        images: formData.images,
        videos: formData.videos.length ? formData.videos : undefined,
        features: cleanFeatures.length ? cleanFeatures : undefined,
        benefits: cleanBenefits.length ? cleanBenefits : undefined,
        process: cleanProcess.length ? cleanProcess : undefined,
        stats: cleanStats.length ? cleanStats : undefined,
        tags: formData.tags.length ? formData.tags : undefined,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
        order: formData.order,
        contactPerson: formData.contactPerson.trim() || undefined,
        contactPhone: formData.contactPhone.trim() || undefined,
        contactEmail: formData.contactEmail.trim() || undefined,
      };

      if (initialData) {
        await updateService({ id: initialData._id, ...payload });
        toast({ title: "Success", description: "Service updated successfully." });
      } else {
        await createService(payload);
        toast({ title: "Success", description: "Service created successfully." });
      }
      setOpen(false);
    } catch (error) {
      toast({
        title: `Error ${initialData ? "updating" : "creating"} service`,
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 py-4 px-1 max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Title *</Label>
          <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="col-span-3" placeholder="Service title" />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Short Title</Label>
          <Input value={formData.shortTitle} onChange={e => setFormData(p => ({ ...p, shortTitle: e.target.value }))} className="col-span-3" placeholder="e.g. SRHR, NCDs" />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Slug</Label>
          <Input value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="col-span-3" placeholder="url-friendly-slug (auto if blank)" />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Category</Label>
          <Select value={formData.category} onValueChange={val => setFormData(p => ({ ...p, category: val }))}>
            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-start gap-3">
          <Label className="text-right text-sm pt-2">Description *</Label>
          <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="col-span-3" placeholder="Short description (shown in cards)" rows={3} />
        </div>
        <div className="grid grid-cols-4 items-start gap-3">
          <Label className="text-right text-sm pt-2">Overview</Label>
          <Textarea value={formData.overview} onChange={e => setFormData(p => ({ ...p, overview: e.target.value }))} className="col-span-3" placeholder="Full overview shown on the service detail page" rows={4} />
        </div>
      </div>

      {/* Media Upload */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Images & Videos</h3>
        <UploadDropzone
          endpoint="serviceMediaUploader"
          onClientUploadComplete={(res: any[]) => { if (res) handleUploadComplete(res); }}
          onUploadError={(error) => {
            toast({
              title: "Upload failed",
              description: error instanceof Error ? error.message : String(error),
              variant: "destructive",
            });
          }}
          appearance={{ button: "bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700", label: "text-sm text-gray-600" }}
        />
        {formData.images.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Set hero image (first selected):</p>
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map(url => (
                <div key={url} className={`relative group aspect-square cursor-pointer rounded-md overflow-hidden border-2 ${formData.heroImage === url ? "border-primary" : "border-transparent"}`} onClick={() => setFormData(p => ({ ...p, heroImage: url }))}>
                  <Image src={url} alt="Service image" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  {formData.heroImage === url && <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1 rounded">Hero</div>}
                  <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); handleRemoveFile(url); }}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {formData.videos.map(url => (
          <div key={url} className="relative group rounded-md overflow-hidden">
            <video src={url} controls className="w-full h-32 object-cover rounded-md border bg-black" />
            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveFile(url)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Service Features</h3>
        {features.map((feature, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input value={feature.title} onChange={e => { const f = [...features]; f[i] = { ...f[i], title: e.target.value }; setFeatures(f); }} placeholder="Feature title" />
              <Input value={feature.description} onChange={e => { const f = [...features]; f[i] = { ...f[i], description: e.target.value }; setFeatures(f); }} placeholder="Feature description" />
            </div>
            <Button variant="ghost" size="icon" className="text-destructive mt-0.5" onClick={() => setFeatures(features.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setFeatures([...features, { title: "", description: "" }])}>
          <Plus className="h-4 w-4 mr-1" /> Add Feature
        </Button>
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Key Benefits</h3>
        {benefits.map((benefit, i) => (
          <div key={i} className="flex gap-2">
            <Input value={benefit} onChange={e => { const b = [...benefits]; b[i] = e.target.value; setBenefits(b); }} placeholder={`Benefit ${i + 1}`} className="flex-1" />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setBenefits([...benefits, ""])}>
          <Plus className="h-4 w-4 mr-1" /> Add Benefit
        </Button>
      </div>

      {/* Process */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Our Process</h3>
        {processSteps.map((step, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground w-6 text-center">{i + 1}.</span>
            <Input value={step} onChange={e => { const p = [...processSteps]; p[i] = e.target.value; setProcessSteps(p); }} placeholder={`Step ${i + 1}`} className="flex-1" />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setProcessSteps(processSteps.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setProcessSteps([...processSteps, ""])}>
          <Plus className="h-4 w-4 mr-1" /> Add Step
        </Button>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Impact Statistics</h3>
        {stats.map((stat, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input value={stat.value} onChange={e => { const s = [...stats]; s[i] = { ...s[i], value: e.target.value }; setStats(s); }} placeholder="Value (e.g. 500+)" className="w-28" />
            <Input value={stat.label} onChange={e => { const s = [...stats]; s[i] = { ...s[i], label: e.target.value }; setStats(s); }} placeholder="Label (e.g. Clients Served)" className="flex-1" />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setStats(stats.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setStats([...stats, { label: "", value: "" }])}>
          <Plus className="h-4 w-4 mr-1" /> Add Stat
        </Button>
      </div>

      {/* Contact */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Contact Information</h3>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Contact Person</Label>
          <Input value={formData.contactPerson} onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))} className="col-span-3" placeholder="Primary contact person" />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Phone</Label>
          <Input value={formData.contactPhone} onChange={e => setFormData(p => ({ ...p, contactPhone: e.target.value }))} className="col-span-3" placeholder="Contact phone" />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Email</Label>
          <Input value={formData.contactEmail} onChange={e => setFormData(p => ({ ...p, contactEmail: e.target.value }))} className="col-span-3" placeholder="Contact email" />
        </div>
      </div>

      {/* Tags & Settings */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold border-b pb-2">Tags & Settings</h3>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Tags</Label>
          <Input value={tagsInput} onChange={e => handleTagsChange(e.target.value)} className="col-span-3" placeholder="Comma-separated tags" />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Sort Order</Label>
          <Input type="number" value={formData.order ?? ""} onChange={e => setFormData(p => ({ ...p, order: e.target.value ? Number(e.target.value) : undefined }))} className="col-span-3" placeholder="Lower numbers appear first" />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Published</Label>
          <Checkbox checked={formData.isPublished} onCheckedChange={c => setFormData(p => ({ ...p, isPublished: !!c }))} />
        </div>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label className="text-right text-sm">Featured</Label>
          <Checkbox checked={formData.isFeatured} onCheckedChange={c => setFormData(p => ({ ...p, isFeatured: !!c }))} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create Service"}</Button>
      </div>
    </div>
  );
}
