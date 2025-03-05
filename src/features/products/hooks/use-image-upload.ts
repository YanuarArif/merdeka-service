import { useState, useRef } from "react";
import { toast } from "sonner";
import { put } from "@vercel/blob";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./use-product-form";

interface UseImageUploadProps {
  form: UseFormReturn<ProductFormData>;
  initialImages?: string[];
}

export const useImageUpload = ({
  form,
  initialImages = [],
}: UseImageUploadProps) => {
  const [uploadingImg, setUploadingImg] = useState(false);
  const [images, setImages] = useState<string[]>(initialImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const handleFileUpload = async (file: File, index?: number) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload only image files');
      return;
    }

    setUploadingImg(true);
    try {
      const currentFiles = form.getValues("images") || [];
      
      if (index !== undefined) {
        // Replace existing file
        const newFiles = [...currentFiles];
        newFiles[index] = file;
        form.setValue("images", newFiles, { shouldValidate: true });
      } else {
        // Add new file
        form.setValue("images", [...currentFiles, file], {
          shouldValidate: true,
        });
      }

      const blob = await put(file.name, file, {
        access: "public",
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });

      const newImageUrl = blob.url;
      
      if (index !== undefined) {
        // Replace existing image URL
        setImages(prev => {
          const newImages = [...prev];
          newImages[index] = newImageUrl;
          form.setValue("imageUrls", newImages, { shouldValidate: true });
          return newImages;
        });
      } else {
        // Add new image URL
        const updatedImages = [...images, newImageUrl];
        setImages(updatedImages);
        form.setValue("imageUrls", updatedImages, {
          shouldValidate: true,
        });
      }
      
      setReplaceIndex(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (replaceIndex !== null && files.length > 0) {
        await handleFileUpload(files[0], replaceIndex);
      } else {
        // Handle multiple uploads sequentially to avoid overwhelming the server
        for (const file of Array.from(files)) {
          await handleFileUpload(file);
        }
      }
      
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    
    if (files && files.length > 0) {
      if (replaceIndex !== null) {
        await handleFileUpload(files[0], replaceIndex);
      } else {
        // Handle multiple files sequentially
        for (const file of Array.from(files)) {
          await handleFileUpload(file);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      form.setValue("imageUrls", newImages, { shouldValidate: true });
      return newImages;
    });

    const currentFiles = form.getValues("images") || [];
    form.setValue(
      "images",
      currentFiles.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };
  
  const handleReplaceImage = (index: number) => {
    setReplaceIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    images,
    uploadingImg,
    handleImageUpload,
    handleDrop,
    handleDragOver,
    handleRemoveImage,
    handleReplaceImage,
    fileInputRef,
  };
};
