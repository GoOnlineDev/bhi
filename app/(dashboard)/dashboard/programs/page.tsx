"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import React from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { UploadButton } from "@/utils/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Users,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Image as ImageIcon,
  Video,
  Star,
  Phone,
  Mail,
  User
} from "lucide-react";
import Image from "next/image";

const canEdit = (role: string) => ["editor", "admin", "superadmin"].includes(role);
const canApprove = (role: string) => ["admin", "superadmin"].includes(role);

const STATUS_OPTIONS = ["upcoming", "ongoing", "completed"] as const;

export default function ProgramsDashboard() {
  const { toast } = useToast();
  const createProgram = useMutation(api.programs.createProgram);
  const deleteProgram = useMutation(api.programs.deleteProgram);
  const updateProgram = useMutation(api.programs.updateProgram);
  const approvedPrograms = useQuery(api.programs.getApprovedPrograms) || [];
  const unapprovedPrograms = useQuery(api.programs.getUnapprovedPrograms) || [];
  const currentUser = useQuery(api.users.getCurrentUser) || undefined;

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    startDate: Date.now(),
    endDate: undefined as number | undefined,
    location: "",
    images: [] as string[],
    videos: [] as string[],
    status: STATUS_OPTIONS[0],
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    tags: [] as string[],
    relatedNewsIds: [] as Id<"news">[],
    isFeatured: false,
    approved: false,
    createdAt: Date.now(),
  });
  const [editId, setEditId] = useState<Id<"programs"> | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "complete" | "error">("idle");

  const userRole = currentUser?.role ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createProgram({
        ...form,
        startDate: Number(form.startDate),
        endDate: form.endDate ? Number(form.endDate) : undefined,
        createdAt: Date.now(),
        approved: canApprove(userRole) ? form.approved : false,
      });
      setForm({
        name: "",
        description: "",
        goal: "",
        startDate: Date.now(),
        endDate: undefined,
        location: "",
        images: [],
        videos: [],
        status: STATUS_OPTIONS[0],
        contactPerson: "",
        contactPhone: "",
        contactEmail: "",
        tags: [],
        relatedNewsIds: [],
        isFeatured: false,
        approved: false,
        createdAt: Date.now(),
      });
      setUploadProgress("idle");
      toast({
        title: "Success",
        description: "Program created successfully",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: "Failed to create program",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: Id<"programs">) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        await deleteProgram({ id });
        toast({
          title: "Success",
          description: "Program deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete program",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (program: any) => {
    setEditId(program._id as Id<"programs">);
    setEditForm({
      name: program.name,
      description: program.description,
      goal: program.goal,
      startDate: program.startDate,
      endDate: program.endDate,
      location: program.location,
      images: program.images,
      videos: program.videos,
      status: program.status,
      contactPerson: program.contactPerson,
      contactPhone: program.contactPhone,
      contactEmail: program.contactEmail,
      tags: program.tags || [],
      relatedNewsIds: program.relatedNewsIds || [],
      isFeatured: program.isFeatured,
      approved: program.approved,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    setError("");
    try {
      await updateProgram({
        id: editId,
        ...editForm,
        updatedAt: Date.now(),
        approved: canApprove(userRole) ? editForm.approved : false,
      });
      setEditId(null);
      setEditForm({});
      toast({
        title: "Success",
        description: "Program updated successfully",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: "Failed to update program",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleImageUpload = (res: any) => {
    setUploadProgress("uploading");
    if (res && Array.isArray(res)) {
      const images: string[] = [];
      const videos: string[] = [];
      
      res.forEach((file: any) => {
        if (file.type && file.type.startsWith('video/')) {
          videos.push(file.url);
        } else {
          images.push(file.url);
        }
      });
      
      setForm((prev) => ({ 
        ...prev, 
        images: [...prev.images, ...images],
        videos: [...prev.videos, ...videos]
      }));
      
      setUploadProgress("complete");
      toast({
        title: "Upload Complete",
        description: `${images.length + videos.length} file(s) uploaded successfully`,
      });
    }
  };

  const handleEditUpload = (res: any) => {
    if (res && Array.isArray(res)) {
      const images: string[] = [];
      const videos: string[] = [];
      
      res.forEach((file: any) => {
        if (file.type && file.type.startsWith('video/')) {
          videos.push(file.url);
        } else {
          images.push(file.url);
        }
      });
      
      setEditForm((prev: any) => ({ 
        ...prev, 
        images: [...(prev.images || []), ...images],
        videos: [...(prev.videos || []), ...videos]
      }));
    }
  };

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev: any) => ({
        ...prev,
        images: prev.images.filter((_: any, i: number) => i !== index)
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const removeVideo = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev: any) => ({
        ...prev,
        videos: prev.videos.filter((_: any, i: number) => i !== index)
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  const renderUploadArea = () => (
    <div className="space-y-4">
      <UploadButton
        endpoint="programMediaUploader"
        onClientUploadComplete={handleImageUpload}
        onUploadError={(error: Error) => {
          setUploadProgress("error");
          toast({
            title: "Upload Error",
            description: error.message,
            variant: "destructive",
          });
        }}
        appearance={{
          button: {
            background: "transparent",
            border: "2px dashed #d1d5db",
            borderRadius: "12px",
            color: "#6b7280",
            fontWeight: "500",
            fontSize: "14px",
            padding: "24px",
            width: "100%",
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          },
          container: { width: "100%" },
          allowedContent: {
            color: "#9ca3af",
            fontSize: "12px",
            marginTop: "8px"
          }
        }}
        content={{
          button: (
            <div className="flex flex-col items-center gap-2">
              {uploadProgress === "uploading" ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1b7cf3]"></div>
                  <span>Uploading...</span>
                </>
              ) : uploadProgress === "error" ? (
                <>
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <span>Upload failed - try again</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6" />
                  <span>Drop files here or click to upload</span>
                  <span className="text-xs">Images and videos up to 512MB</span>
                </>
              )}
            </div>
          )
        }}
      />
    </div>
  );

  const renderMediaPreviews = (images: string[], videos: string[], isEdit = false) => (
    <div className="space-y-4">
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`Image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(idx, isEdit)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {videos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Video className="w-4 h-4" />
            Videos ({videos.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {videos.map((video, idx) => (
              <div key={idx} className="relative group">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVideo(idx, isEdit)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfaf8] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1c140d] mb-2">Programs Management</h1>
            <p className="text-gray-600">Create and manage health programs and initiatives</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-[#1b7cf3]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-[#1b7cf3]" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">{approvedPrograms.length + unapprovedPrograms.length}</p>
                  <p className="text-sm text-gray-600">Total Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">{approvedPrograms.length}</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Edit3 className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">{unapprovedPrograms.length}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">
                    {[...approvedPrograms, ...unapprovedPrograms].filter(p => p.isFeatured).length}
                  </p>
                  <p className="text-sm text-gray-600">Featured</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {canEdit(userRole) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1c140d]">
                <Plus className="w-5 h-5" />
                Create New Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Program Name *</label>
                    <Input
                      name="name"
                      placeholder="Enter program name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select 
                      value={form.status} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <Textarea
                    name="description"
                    placeholder="Describe the program"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal (Optional)</label>
                  <Input
                    name="goal"
                    placeholder="What is the main goal of this program?"
                    value={form.goal}
                    onChange={handleChange}
                    className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={new Date(form.startDate).toISOString().slice(0, 16)}
                      onChange={e => setForm(f => ({ ...f, startDate: new Date(e.target.value).getTime() }))}
                      required
                      className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time (Optional)</label>
                    <Input
                      type="datetime-local"
                      value={form.endDate ? new Date(form.endDate).toISOString().slice(0, 16) : ""}
                      onChange={e => setForm(f => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))}
                      className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                    <Input
                      name="location"
                      placeholder="Where will this program take place?"
                      value={form.location}
                      onChange={handleChange}
                      className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person (Optional)</label>
                    <Input
                      name="contactPerson"
                      placeholder="Program coordinator name"
                      value={form.contactPerson}
                      onChange={handleChange}
                      className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone (Optional)</label>
                    <Input
                      name="contactPhone"
                      placeholder="Contact phone number"
                      value={form.contactPhone}
                      onChange={handleChange}
                      className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email (Optional)</label>
                    <Input
                      name="contactEmail"
                      type="email"
                      placeholder="Contact email address"
                      value={form.contactEmail}
                      onChange={handleChange}
                      className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={form.isFeatured}
                      onChange={handleChange}
                      className="rounded text-[#1b7cf3] focus:ring-[#1b7cf3]"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Featured Program
                    </label>
                  </div>
                  
                  {canApprove(userRole) && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="approved"
                        checked={form.approved}
                        onChange={handleChange}
                        className="rounded text-[#1b7cf3] focus:ring-[#1b7cf3]"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Approved
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
                  {renderUploadArea()}
                  {(form.images.length > 0 || form.videos.length > 0) && (
                    <div className="mt-4">
                      {renderMediaPreviews(form.images, form.videos)}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1b7cf3] hover:bg-blue-600 text-white"
                  >
                    {loading ? "Creating..." : "Create Program"}
                  </Button>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Unapproved Programs */}
        {canEdit(userRole) && unapprovedPrograms.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1c140d]">
                <Edit3 className="w-5 h-5" />
                Pending Programs ({unapprovedPrograms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unapprovedPrograms.map((program) => (
                  <Card key={program._id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      {editId === program._id ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              required
                              className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                            />
                            <Select 
                              value={editForm.status} 
                              onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                            >
                              <SelectTrigger className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((status) => (
                                  <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            required
                            rows={3}
                            className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Add More Media</label>
                            <UploadButton
                              endpoint="programMediaUploader"
                              onClientUploadComplete={handleEditUpload}
                              onUploadError={(error: Error) => {
                                toast({
                                  title: "Upload Error",
                                  description: error.message,
                                  variant: "destructive",
                                });
                              }}
                              appearance={{
                                button: {
                                  background: "#1b7cf3",
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "8px 16px",
                                  fontSize: "14px",
                                  fontWeight: "500"
                                }
                              }}
                            />
                            {(editForm.images?.length > 0 || editForm.videos?.length > 0) && (
                              <div className="mt-4">
                                {renderMediaPreviews(editForm.images || [], editForm.videos || [], true)}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="isFeatured"
                                checked={!!editForm.isFeatured}
                                onChange={handleEditChange}
                                className="rounded text-[#1b7cf3] focus:ring-[#1b7cf3]"
                              />
                              <label className="text-sm font-medium text-gray-700">
                                Featured
                              </label>
                            </div>
                            
                            {canApprove(userRole) && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  name="approved"
                                  checked={!!editForm.approved}
                                  onChange={handleEditChange}
                                  className="rounded text-[#1b7cf3] focus:ring-[#1b7cf3]"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                  Approved
                                </label>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button type="submit" className="bg-[#1b7cf3] hover:bg-blue-600 text-white">
                              Update
                            </Button>
                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                          {error && <div className="text-red-600 text-sm">{error}</div>}
                        </form>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-[#1c140d] text-lg">{program.name}</h3>
                                {program.isFeatured && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{program.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <Badge variant="outline" className="border-yellow-500 text-yellow-700 capitalize">
                                  {program.status}
                                </Badge>
                                {program.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {program.location}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {program.startDate ? new Date(program.startDate).toLocaleDateString() : ""}
                                </span>
                              </div>
                            </div>
                            <Badge className="bg-yellow-500 text-white">
                              {program.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>

                          {(program.images?.length > 0 || program.videos?.length > 0) && (
                            <div className="mb-4">
                              {renderMediaPreviews(program.images || [], program.videos || [])}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {canEdit(userRole) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(program)}
                                className="border-[#1b7cf3] text-[#1b7cf3] hover:bg-[#1b7cf3] hover:text-white"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            )}
                            {canEdit(userRole) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(program._id as Id<"programs">)}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approved Programs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1c140d]">
              <Eye className="w-5 h-5" />
              Approved Programs ({approvedPrograms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedPrograms.map((program) => (
                <Card key={program._id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    {editId === program._id ? (
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            required
                            className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                          />
                          <Select 
                            value={editForm.status} 
                            onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          required
                          rows={3}
                          className="focus:ring-[#1b7cf3] focus:border-[#1b7cf3]"
                        />
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Add More Media</label>
                          <UploadButton
                            endpoint="programMediaUploader"
                            onClientUploadComplete={handleEditUpload}
                            onUploadError={(error: Error) => {
                              toast({
                                title: "Upload Error",
                                description: error.message,
                                variant: "destructive",
                              });
                            }}
                            appearance={{
                              button: {
                                background: "#1b7cf3",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "8px 16px",
                                fontSize: "14px",
                                fontWeight: "500"
                              }
                            }}
                          />
                          {(editForm.images?.length > 0 || editForm.videos?.length > 0) && (
                            <div className="mt-4">
                              {renderMediaPreviews(editForm.images || [], editForm.videos || [], true)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isFeatured"
                              checked={!!editForm.isFeatured}
                              onChange={handleEditChange}
                              className="rounded text-[#1b7cf3] focus:ring-[#1b7cf3]"
                            />
                            <label className="text-sm font-medium text-gray-700">
                              Featured
                            </label>
                          </div>
                          
                          {canApprove(userRole) && (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="approved"
                                checked={!!editForm.approved}
                                onChange={handleEditChange}
                                className="rounded text-[#1b7cf3] focus:ring-[#1b7cf3]"
                              />
                              <label className="text-sm font-medium text-gray-700">
                                Approved
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" className="bg-[#1b7cf3] hover:bg-blue-600 text-white">
                            Update
                          </Button>
                          <Button type="button" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                      </form>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#1c140d] text-lg">{program.name}</h3>
                              {program.isFeatured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{program.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              <Badge variant="outline" className="border-green-500 text-green-700 capitalize">
                                {program.status}
                              </Badge>
                              {program.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {program.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {program.startDate ? new Date(program.startDate).toLocaleDateString() : ""}
                              </span>
                            </div>
                            
                            {(program.contactPerson || program.contactPhone || program.contactEmail) && (
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {program.contactPerson && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {program.contactPerson}
                                  </span>
                                )}
                                {program.contactPhone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {program.contactPhone}
                                  </span>
                                )}
                                {program.contactEmail && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {program.contactEmail}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Badge className="bg-green-500 text-white">
                            Approved
                          </Badge>
                        </div>

                        {(program.images?.length > 0 || program.videos?.length > 0) && (
                          <div className="mb-4">
                            {renderMediaPreviews(program.images || [], program.videos || [])}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {canEdit(userRole) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(program)}
                              className="border-[#1b7cf3] text-[#1b7cf3] hover:bg-[#1b7cf3] hover:text-white"
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {canEdit(userRole) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(program._id as Id<"programs">)}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
