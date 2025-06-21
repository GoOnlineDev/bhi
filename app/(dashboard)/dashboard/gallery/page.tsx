"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Camera, 
  Video, 
  MapPin, 
  Calendar, 
  Tag,
  Filter,
  X,
  AlertCircle,
  Upload
} from "lucide-react";

type GalleryItem = {
  _id: Id<"gallery">;
  title: string;
  description: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  category: string;
  date: number;
  location?: string;
  tags: string[];
  createdAt: number;
  updatedAt?: number;
  isPublished: boolean;
  uploadedBy?: string;
};

const categories = [
  "Maternal Health",
  "Education",
  "Mental Health",
  "Clinical Services",
  "Laboratory",
  "Facilities",
  "Community Outreach",
  "Youth Services",
  "Nursing",
  "Environmental Health",
  "Training"
];

export default function DashboardGalleryPage() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [viewFilter, setViewFilter] = useState<"all" | "published" | "unpublished">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "complete" | "error">("idle");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{url: string; type: string}>>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image" as "image" | "video",
    url: "",
    thumbnail: "",
    category: categories[0],
    date: new Date().toISOString().split('T')[0],
    location: "",
    tags: "",
    isPublished: false,
  });

  // Queries
  const publishedGallery = useQuery(api.gallery.getPublishedGallery);
  const unpublishedGallery = useQuery(api.gallery.getUnpublishedGallery);
  const galleryStats = useQuery(api.gallery.getGalleryStats);

  // Mutations
  const createGalleryItem = useMutation(api.gallery.createGalleryItem);
  const updateGalleryItem = useMutation(api.gallery.updateGalleryItem);
  const deleteGalleryItem = useMutation(api.gallery.deleteGalleryItem);

  // Combine and filter gallery items
  const allGalleryItems = [
    ...(publishedGallery || []),
    ...(unpublishedGallery || [])
  ];

  const filteredItems = allGalleryItems.filter(item => {
    if (viewFilter === "published" && !item.isPublished) return false;
    if (viewFilter === "unpublished" && item.isPublished) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    return true;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "image",
      url: "",
      thumbnail: "",
      category: categories[0],
      date: new Date().toISOString().split('T')[0],
      location: "",
      tags: "",
      isPublished: false,
    });
    setUploadedFiles([]);
    setUploadProgress("idle");
  };

  const handleCreate = async () => {
    try {
      if (!formData.title || !formData.description || !formData.url) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      await createGalleryItem({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: formData.url,
        thumbnail: formData.thumbnail || undefined,
        category: formData.category as any,
        date: new Date(formData.date).getTime(),
        location: formData.location || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPublished: formData.isPublished,
      });

      toast({
        title: "Success",
        description: "Gallery item created successfully",
      });

      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create gallery item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      url: item.url,
      thumbnail: item.thumbnail || "",
      category: item.category,
      date: new Date(item.date).toISOString().split('T')[0],
      location: item.location || "",
      tags: item.tags.join(', '),
      isPublished: item.isPublished,
    });
    // Reset upload states when editing
    setUploadedFiles([]);
    setUploadProgress("idle");
    setIsEditModalOpen(true);
  };

  const clearCurrentMedia = () => {
    setFormData(prev => ({ ...prev, url: "", type: "image" }));
    toast({
      title: "Media Cleared",
      description: "Current media removed. Upload new media to replace it.",
    });
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      await updateGalleryItem({
        id: selectedItem._id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: formData.url,
        thumbnail: formData.thumbnail || undefined,
        category: formData.category as any,
        date: new Date(formData.date).getTime(),
        location: formData.location || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPublished: formData.isPublished,
      });

      toast({
        title: "Success",
        description: "Gallery item updated successfully",
      });

      setIsEditModalOpen(false);
      setSelectedItem(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update gallery item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: Id<"gallery">) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      await deleteGalleryItem({ id });
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    }
  };

  const handleMediaUpload = (res: any) => {
    if (res?.[0]?.url) {
      const fileType = res[0].type;
      const newFile = { 
        url: res[0].url, 
        type: fileType.startsWith('image/') ? 'image' : 'video' 
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      if (fileType.startsWith('image/')) {
        setFormData(prev => ({ ...prev, type: "image", url: res[0].url }));
      } else if (fileType.startsWith('video/')) {
        setFormData(prev => ({ ...prev, type: "video", url: res[0].url }));
      }
      
      setUploadProgress("complete");
      toast({
        title: "Upload Successful",
        description: "Media file uploaded successfully",
      });
    } else {
      setUploadProgress("error");
    }
  };

  const removeUploadedFile = (index: number) => {
    const removedFile = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    
    // If this was the selected media, clear the form data
    if (formData.url === removedFile.url) {
      setFormData(prev => ({ ...prev, url: "", type: "image" }));
    }
    
    toast({
      title: "File Removed",
      description: "File removed from upload queue",
    });
  };

  const renderUploadArea = () => (
    <div className="space-y-4">
      <UploadButton
        endpoint="galleryMediaUploader"
        onClientUploadComplete={handleMediaUpload}
        onUploadBegin={() => {
          setUploadProgress("uploading");
        }}
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f37c1b]"></div>
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
                  <span>Upload Media</span>
                  <span className="text-xs">Drop files or click</span>
                </>
              )}
            </div>
          )
        }}
      />

      {/* Media Previews */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  {file.type === 'image' ? (
                    <Image
                      src={file.url}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadedFile(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </Button>
                <div className="absolute bottom-1 left-1">
                  <Badge variant="secondary" className="text-xs">
                    {file.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentMedia = () => {
    if (!formData.url) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Current Media</h4>
        <div className="relative group w-fit">
          <div className="aspect-video w-48 rounded-lg overflow-hidden bg-gray-100">
            {formData.type === 'image' ? (
              <Image
                src={formData.url}
                alt="Current media"
                fill
                className="object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                {formData.thumbnail ? (
                  <Image
                    src={formData.thumbnail}
                    alt="Video thumbnail"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-[#f37c1b]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCurrentMedia}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </Button>
          <div className="absolute bottom-1 left-1">
            <Badge variant="secondary" className="text-xs">
              {formData.type}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1c140d] mb-2">Gallery Management</h1>
            <p className="text-gray-600">Manage photos and videos in your gallery</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#f37c1b] hover:bg-[#ff9d4d] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Gallery Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. health, education, community"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Media *</label>
                  {renderUploadArea()}
                </div>

                {formData.type === "video" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Thumbnail URL (optional)</label>
                    <Input
                      value={formData.thumbnail}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      placeholder="Enter thumbnail URL"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium">
                    Publish immediately
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreate} className="bg-[#f37c1b] hover:bg-[#ff9d4d] text-white">
                    Create Gallery Item
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        {galleryStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="text-2xl font-bold text-[#1c140d]">{galleryStats.total}</p>
                    <p className="text-sm text-gray-600">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="text-2xl font-bold text-[#1c140d]">{galleryStats.images}</p>
                    <p className="text-sm text-gray-600">Images</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="text-2xl font-bold text-[#1c140d]">{galleryStats.videos}</p>
                    <p className="text-sm text-gray-600">Videos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="text-2xl font-bold text-[#1c140d]">{Object.keys(galleryStats.categories).length}</p>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={viewFilter} onValueChange={(value: any) => setViewFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="published">Published Only</SelectItem>
              <SelectItem value="unpublished">Unpublished Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gallery Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Video className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-[#f37c1b]" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className={item.isPublished ? "bg-green-500" : "bg-yellow-500"}>
                    {item.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  {item.type === "video" ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#1c140d] mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Badge variant="outline">{item.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                {item.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                  <Tag className="w-3 h-3" />
                  <span>{item.tags.join(', ')}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No gallery items found</h3>
            <p className="text-gray-600 mb-6">
              {viewFilter === "all" ? "Start by adding your first gallery item." : "No items match your current filters."}
            </p>
            {viewFilter !== "all" && (
              <Button variant="outline" onClick={() => { setViewFilter("all"); setCategoryFilter("all"); }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Gallery Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g. health, education, community"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Media</label>
                {renderCurrentMedia()}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Replace Media (optional)</label>
                  {renderUploadArea()}
                </div>
              </div>

              {formData.type === "video" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail URL (optional)</label>
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="Enter thumbnail URL"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                />
                <label htmlFor="editIsPublished" className="text-sm font-medium">
                  Published
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdate} className="bg-[#f37c1b] hover:bg-[#ff9d4d] text-white">
                  Update Gallery Item
                </Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 