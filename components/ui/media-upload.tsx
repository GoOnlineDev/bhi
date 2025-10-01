"use client";

import { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, FileImage, Video, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface UploadedFile {
  url: string;
  type: string;
  name: string;
  uploadedBy: string;
}

interface MediaUploadProps {
  endpoint: "imageUploader" | "programMediaUploader" | "newsMediaUploader" | "galleryMediaUploader";
  onUploadComplete: (files: UploadedFile[]) => void;
  onRemoveFile?: (url: string) => void;
  uploadedFiles?: UploadedFile[];
  maxImages?: number;
  maxVideos?: number;
  maxFileSize?: string;
  className?: string;
}

export function MediaUpload({
  endpoint,
  onUploadComplete,
  onRemoveFile,
  uploadedFiles = [],
  maxImages = 10,
  maxVideos = 5,
  maxFileSize = "16MB",
  className = ""
}: MediaUploadProps) {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const images = uploadedFiles.filter(file => file.type.startsWith('image/'));
  const videos = uploadedFiles.filter(file => file.type.startsWith('video/'));

  const handleUploadComplete = (res: any[]) => {
    console.log("Upload complete:", res);
    
    if (!res || !Array.isArray(res)) {
      console.error("Invalid upload response:", res);
      toast({ title: "Upload error", description: "Invalid response from upload", variant: "destructive" });
      return;
    }

    // Transform the response to match our UploadedFile interface
    const uploadedFiles: UploadedFile[] = res.map(file => ({
      url: file.url,
      type: file.type,
      name: file.name,
      uploadedBy: file.uploadedBy
    }));

    onUploadComplete(uploadedFiles);
    setIsUploading(false);
    setUploadProgress(0);

    const totalUploaded = res.length;
    if (totalUploaded > 0) {
      toast({ 
        title: "Upload complete", 
        description: `Successfully uploaded ${totalUploaded} file${totalUploaded > 1 ? 's' : ''}` 
      });
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleUploadBegin = (fileName: string) => {
    console.log("Starting upload:", fileName);
    setIsUploading(true);
    setUploadProgress(0);
  };

  const handleRemoveFile = (url: string) => {
    if (onRemoveFile) {
      onRemoveFile(url);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Uploading files...</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          onUploadBegin={handleUploadBegin}
          onUploadProgress={setUploadProgress}
          className="ut-label:text-primary ut-upload-icon:text-primary/80 ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
        />
      </div>

      {/* Upload Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileImage className="h-4 w-4" />
            {images.length} images
          </span>
          <span className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            {videos.length} videos
          </span>
        </div>
        <span>Max: {maxImages} images, {maxVideos} videos ({maxFileSize} each)</span>
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Uploaded Media</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((file, index) => (
              <div key={`${file.url}-${index}`} className="relative group aspect-square">
                <Image 
                  src={file.url} 
                  alt={file.name || `Uploaded image ${index + 1}`} 
                  fill 
                  className="object-cover rounded-md border" 
                />
                {onRemoveFile && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleRemoveFile(file.url)} 
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {videos.map((file, index) => (
              <div key={`${file.url}-${index}`} className="relative group aspect-square">
                <video 
                  src={file.url} 
                  controls 
                  className="w-full h-full object-cover rounded-md border bg-black" 
                />
                {onRemoveFile && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleRemoveFile(file.url)} 
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 