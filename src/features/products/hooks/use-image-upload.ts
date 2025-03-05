import { useState } from "react";
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

  const handleFileUpload = async (file: File) => {
    setUploadingImg(true);
    try {
      const currentFiles = form.getValues("images") || [];
      form.setValue("images", [...currentFiles, file], {
        shouldValidate: true,
      });

      const blob = await put(file.name, file, {
        access: "public",
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });

      const newImageUrl = blob.url;
      const updatedImages = [...images, newImageUrl];

      setImages(updatedImages);
      form.setValue("imageUrls", updatedImages, {
        shouldValidate: true,
      });
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
      await Promise.all(
        Array.from(files).map((file) => handleFileUpload(file))
      );
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await Promise.all(
        Array.from(files).map((file) => handleFileUpload(file))
      );
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

  return {
    images,
    uploadingImg,
    handleImageUpload,
    handleDrop,
    handleDragOver,
    handleRemoveImage,
  };
};
