/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UploadCloud, X, Image as ImageIcon, Link as LinkIcon, Edit } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";

export function MediaUploader({ value, onChange, bucketName = "portfolio" }) {
  const [tab, setTab] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [fileToCrop, setFileToCrop] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setFileToCrop(reader.result);
        setCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
    maxFiles: 1,
  });

  const uploadFile = async (blob) => {
    setUploading(true);
    try {
      const filename = `${uuidv4()}.jpeg`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filename, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      setPreview(publicData.publicUrl);
      onChange(publicData.publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image. Please check your connection and try again.");
    } finally {
      setUploading(false);
      setFileToCrop(null);
      setCropperOpen(false);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    await uploadFile(croppedBlob);
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
        setPreview(urlInput);
        onChange(urlInput);
    }
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      <Label>Project Image</Label>
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border group bg-muted aspect-video flex items-center justify-center">
            <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setPreview("")}>
                    <Edit className="h-4 w-4 mr-2" /> Change
                </Button>
                <Button variant="destructive" size="sm" onClick={clearImage}>
                    <X className="h-4 w-4 mr-2" /> Remove
                </Button>
            </div>
        </div>
      ) : (
        <Tabs defaultValue="upload" value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload"><UploadCloud className="h-4 w-4 mr-2"/> Upload</TabsTrigger>
                <TabsTrigger value="url"><LinkIcon className="h-4 w-4 mr-2"/> URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"}
                    `}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4 gap-2">
                            <div className="p-3 bg-muted rounded-full">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="text-sm font-medium">
                                Click or drag image to upload
                            </div>
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG, WEBP up to 5MB
                            </p>
                        </div>
                    )}
                </div>
            </TabsContent>
            
            <TabsContent value="url" className="mt-4 space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="https://example.com/image.jpg" 
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <Button onClick={handleUrlSubmit} type="button">Set URL</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Paste a direct link to an image.
                </p>
            </TabsContent>
        </Tabs>
      )}

      {fileToCrop && (
        <ImageCropper
            open={cropperOpen}
            onOpenChange={setCropperOpen}
            imageSrc={fileToCrop}
            onCropComplete={handleCropComplete}
            loading={uploading}
            onCancel={() => {
                setCropperOpen(false);
                setFileToCrop(null);
            }}
        />
      )}
    </div>
  );
}
