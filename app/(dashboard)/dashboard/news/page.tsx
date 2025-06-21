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
  FileText, 
  Calendar, 
  Building2, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Image as ImageIcon,
  Video,
  Clock,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

const canEdit = (role: string) => ["editor", "admin", "superadmin"].includes(role);
const canApprove = (role: string) => ["admin", "superadmin"].includes(role);

const CATEGORY_OPTIONS = [
  "Announcements",
  "Health Tips",
  "Community Programs",
  "Medical Updates",
  "Staff Highlights",
  "Success Stories",
  "Event Recaps",
  "Policy Changes",
  "Emergency Alerts",
  "Research & Innovation"
] as const;

const INSTITUTION_OPTIONS = [
  "Boost Health Initiative",
  "Suubi Medical Centre"
] as const;

export default function NewsDashboard() {
  const { toast } = useToast();
  const createNews = useMutation(api.news.createNews);
  const deleteNews = useMutation(api.news.deleteNews);
  const updateNews = useMutation(api.news.updateNews);
  const newsList = useQuery(api.news.getPublishedNews) || [];
  const unpublishedNews = useQuery(api.news.getUnpublishedNews) || [];
  const currentUser = useQuery(api.users.getCurrentUser) || undefined;

  // Form state
  const [form, setForm] = useState({
    title: "",
    content: "",
    summary: "",
    images: [] as string[],
    videos: [] as string[],
    category: CATEGORY_OPTIONS[0],
    startDate: Date.now(),
    endDate: undefined as number | undefined,
    institution: INSTITUTION_OPTIONS[0],
    publishedAt: Date.now(),
  });
  // Edit form type definition
  type EditFormType = {
    title: string;
    content: string;
    summary: string;
    images: string[];
    videos: string[];
    category: typeof CATEGORY_OPTIONS[number];
    startDate: number;
    endDate?: number;
    institution: typeof INSTITUTION_OPTIONS[number];
    isPublished: boolean;
  };

  const [editId, setEditId] = useState<Id<"news"> | null>(null);
  const [editForm, setEditForm] = useState<EditFormType>({
    title: "",
    content: "",
    summary: "",
    images: [],
    videos: [],
    category: CATEGORY_OPTIONS[0],
    startDate: Date.now(),
    endDate: undefined,
    institution: INSTITUTION_OPTIONS[0],
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "complete" | "error">("idle");

  const userRole = currentUser?.role ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createNews({
        ...form,
        startDate: Number(form.startDate),
        endDate: form.endDate ? Number(form.endDate) : undefined,
        publishedAt: Date.now(),
      });
      setForm({
        title: "",
        content: "",
        summary: "",
        images: [],
        videos: [],
        category: CATEGORY_OPTIONS[0],
        startDate: Date.now(),
        endDate: undefined,
        institution: INSTITUTION_OPTIONS[0],
        publishedAt: Date.now(),
      });
      toast({
        title: "Success",
        description: "News article created successfully",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: "Failed to create news article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: Id<"news">) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      try {
        await deleteNews({ id });
        toast({
          title: "Success",
          description: "News article deleted successfully",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete news article",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (news: any) => {
    setEditId(news._id as Id<"news">);
    setEditForm({
      title: news.title,
      content: news.content,
      summary: news.summary,
      images: news.images || [],
      videos: news.videos || [],
      category: news.category,
      startDate: news.startDate,
      endDate: news.endDate,
      institution: news.institution,
      isPublished: news.isPublished,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    setError("");
    try {
      await updateNews({
        id: editId,
        ...editForm,
        updatedAt: Date.now(),
        isPublished: canApprove(userRole) ? editForm.isPublished : false,
      });
      setEditId(null);
      setEditForm({
        title: "",
        content: "",
        summary: "",
        images: [],
        videos: [],
        category: CATEGORY_OPTIONS[0],
        startDate: Date.now(),
        endDate: undefined,
        institution: INSTITUTION_OPTIONS[0],
        isPublished: false,
      });
      toast({
        title: "Success",
        description: "News article updated successfully",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: "Failed to update news article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({
      title: "",
      content: "",
      summary: "",
      images: [],
      videos: [],
      category: CATEGORY_OPTIONS[0],
      startDate: Date.now(),
      endDate: undefined,
      institution: INSTITUTION_OPTIONS[0],
      isPublished: false,
    });
  };

  const handleMediaUpload = (res: any) => {
    setUploadProgress("uploading");
    if (res && Array.isArray(res)) {
      const newImages: string[] = [];
      const newVideos: string[] = [];
      
      res.forEach((file: any) => {
        if (file.type?.startsWith('image/')) {
          newImages.push(file.url);
        } else if (file.type?.startsWith('video/')) {
          newVideos.push(file.url);
        }
      });
      
      setForm((prev) => ({ 
        ...prev, 
        images: [...prev.images, ...newImages],
        videos: [...prev.videos, ...newVideos]
      }));
      
      setUploadProgress("complete");
      toast({
        title: "Upload Complete",
        description: `${newImages.length + newVideos.length} file(s) uploaded successfully`,
      });
    } else {
      setUploadProgress("error");
    }
  };

  const handleEditMediaUpload = (res: any) => {
    if (res && Array.isArray(res)) {
      const newImages: string[] = [];
      const newVideos: string[] = [];
      
      res.forEach((file: any) => {
        if (file.type?.startsWith('image/')) {
          newImages.push(file.url);
        } else if (file.type?.startsWith('video/')) {
          newVideos.push(file.url);
        }
      });
      
      setEditForm((prev: EditFormType) => ({ 
        ...prev, 
        images: [...(prev.images || []), ...newImages],
        videos: [...(prev.videos || []), ...newVideos]
      }));
      
      toast({
        title: "Upload Complete",
        description: `${newImages.length + newVideos.length} file(s) uploaded successfully`,
      });
    }
  };

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev: EditFormType) => ({
        ...prev,
        images: (prev.images || []).filter((_, i: number) => i !== index)
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
    toast({
      title: "Image Removed",
      description: "Image removed from article",
    });
  };

  const removeVideo = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev: EditFormType) => ({
        ...prev,
        videos: (prev.videos || []).filter((_, i: number) => i !== index)
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
    toast({
      title: "Video Removed",
      description: "Video removed from article",
    });
  };

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

  const renderUploadArea = (onUpload: (res: any) => void) => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <UploadButton
          endpoint="newsMediaUploader"
          onClientUploadComplete={onUpload}
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
              border: "none",
              color: "#6b7280",
              fontWeight: "500",
              fontSize: "14px",
              cursor: "pointer",
              width: "100%",
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
              <div className="flex flex-col items-center gap-3">
                {uploadProgress === "uploading" ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span>Uploading media...</span>
                  </>
                ) : uploadProgress === "error" ? (
                  <>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <span>Upload failed - try again</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Upload images and videos</p>
                      <p className="text-sm text-gray-500">Drop files here or click to browse</p>
                    </div>
                  </>
                )}
              </div>
            )
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfaf8] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1c140d] mb-2">News Management</h1>
            <p className="text-gray-600">Create and manage news articles and announcements</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">{newsList.length + unpublishedNews.length}</p>
                  <p className="text-sm text-gray-600">Total Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">{newsList.length}</p>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Edit3 className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">{unpublishedNews.length}</p>
                  <p className="text-sm text-gray-600">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-[#1c140d]">{INSTITUTION_OPTIONS.length}</p>
                  <p className="text-sm text-gray-600">Institutions</p>
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
                Create New Article
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <Input
                      name="title"
                      placeholder="Enter article title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select 
                      value={form.category} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary *</label>
                  <Textarea
                    name="summary"
                    placeholder="Brief summary of the article"
                    value={form.summary}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <Textarea
                    name="content"
                    placeholder="Full article content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                    <Select 
                      value={form.institution} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, institution: value as any }))}
                    >
                      <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTITUTION_OPTIONS.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={new Date(form.startDate).toISOString().slice(0, 16)}
                      onChange={e => setForm(f => ({ ...f, startDate: new Date(e.target.value).getTime() }))}
                      required
                      className="focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time (Optional)</label>
                  <Input
                    type="datetime-local"
                    value={form.endDate ? new Date(form.endDate).toISOString().slice(0, 16) : ""}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media Upload</label>
                  {renderUploadArea(handleMediaUpload)}
                </div>

                {(form.images.length > 0 || form.videos.length > 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Media</label>
                    {renderMediaPreviews(form.images, form.videos, false)}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {loading ? "Creating..." : "Create Article"}
                  </Button>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Unpublished News */}
        {canEdit(userRole) && unpublishedNews.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1c140d]">
                <Edit3 className="w-5 h-5" />
                Draft Articles ({unpublishedNews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unpublishedNews.map((news) => (
                  <Card key={news._id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-6">
                      {editId === news._id ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                          <Input
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            required
                            className="font-semibold"
                          />
                          <Textarea
                            name="summary"
                            value={editForm.summary}
                            onChange={handleEditChange}
                            required
                            rows={2}
                          />
                          <Textarea
                            name="content"
                            value={editForm.content}
                            onChange={handleEditChange}
                            required
                            rows={4}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select 
                              value={editForm.category} 
                              onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value as typeof CATEGORY_OPTIONS[number] }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORY_OPTIONS.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={editForm.institution} 
                              onValueChange={(value) => setEditForm(prev => ({ ...prev, institution: value as typeof INSTITUTION_OPTIONS[number] }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {INSTITUTION_OPTIONS.map((inst) => (
                                  <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                              <Input
                                type="datetime-local"
                                value={new Date(editForm.startDate).toISOString().slice(0, 16)}
                                onChange={e => setEditForm(f => ({ ...f, startDate: new Date(e.target.value).getTime() }))}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                              <Input
                                type="datetime-local"
                                value={editForm.endDate ? new Date(editForm.endDate).toISOString().slice(0, 16) : ""}
                                onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Add More Media</label>
                            {renderUploadArea(handleEditMediaUpload)}
                          </div>

                          {((editForm.images && editForm.images.length > 0) || (editForm.videos && editForm.videos.length > 0)) && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Current Media</label>
                              {renderMediaPreviews(editForm.images || [], editForm.videos || [], true)}
                            </div>
                          )}

                          {canApprove(userRole) && (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="isPublished"
                                checked={!!editForm.isPublished}
                                onChange={e => setEditForm({ ...editForm, isPublished: e.target.checked })}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor="isPublished" className="text-sm font-medium">
                                Publish immediately
                              </label>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4">
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                              Update Article
                            </Button>
                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                          {error && <div className="text-red-600 text-sm">{error}</div>}
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-[#1c140d] mb-2">{news.title}</h3>
                              <p className="text-gray-600 mb-2">{news.summary}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <Badge variant="outline">{news.category}</Badge>
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>{news.institution}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{news.startDate ? new Date(news.startDate).toLocaleDateString() : ""}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                              Draft
                            </Badge>
                          </div>

                          {((news.images && news.images.length > 0) || (news.videos && news.videos.length > 0)) && (
                            <div className="mb-4">
                              {renderMediaPreviews(news.images || [], news.videos || [], false)}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(news)}
                              className="flex items-center gap-1"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(news._id as Id<"news">)}
                              className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Published News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1c140d]">
              <Eye className="w-5 h-5" />
              Published Articles ({newsList.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newsList.map((news) => (
                <Card key={news._id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    {editId === news._id ? (
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <Input
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          required
                          className="font-semibold"
                        />
                        <Textarea
                          name="summary"
                          value={editForm.summary}
                          onChange={handleEditChange}
                          required
                          rows={2}
                        />
                        <Textarea
                          name="content"
                          value={editForm.content}
                          onChange={handleEditChange}
                          required
                          rows={4}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select 
                            value={editForm.category} 
                            onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value as typeof CATEGORY_OPTIONS[number] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_OPTIONS.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select 
                            value={editForm.institution} 
                            onValueChange={(value) => setEditForm(prev => ({ ...prev, institution: value as typeof INSTITUTION_OPTIONS[number] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {INSTITUTION_OPTIONS.map((inst) => (
                                <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                            <Input
                              type="datetime-local"
                              value={new Date(editForm.startDate).toISOString().slice(0, 16)}
                              onChange={e => setEditForm(f => ({ ...f, startDate: new Date(e.target.value).getTime() }))}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                            <Input
                              type="datetime-local"
                              value={editForm.endDate ? new Date(editForm.endDate).toISOString().slice(0, 16) : ""}
                              onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Add More Media</label>
                          {renderUploadArea(handleEditMediaUpload)}
                        </div>

                        {((editForm.images && editForm.images.length > 0) || (editForm.videos && editForm.videos.length > 0)) && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Media</label>
                            {renderMediaPreviews(editForm.images || [], editForm.videos || [], true)}
                          </div>
                        )}

                        {canApprove(userRole) && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isPublished"
                              checked={!!editForm.isPublished}
                              onChange={e => setEditForm({ ...editForm, isPublished: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor="isPublished" className="text-sm font-medium">
                              Keep published
                            </label>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4">
                          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                            Update Article
                          </Button>
                          <Button type="button" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                      </form>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-[#1c140d] mb-2">{news.title}</h3>
                            <p className="text-gray-600 mb-2">{news.summary}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <Badge variant="outline">{news.category}</Badge>
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                <span>{news.institution}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{news.startDate ? new Date(news.startDate).toLocaleDateString() : ""}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            Published
                          </Badge>
                        </div>

                        {((news.images && news.images.length > 0) || (news.videos && news.videos.length > 0)) && (
                          <div className="mb-4">
                            {renderMediaPreviews(news.images || [], news.videos || [], false)}
                          </div>
                        )}

                        {canEdit(userRole) && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(news)}
                              className="flex items-center gap-1"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(news._id as Id<"news">)}
                              className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {newsList.length === 0 && (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No published articles yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create and publish your first news article to get started.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
