import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../hooks/use-product-form";
import { useImageUpload } from "../hooks/use-image-upload";
import { Button } from "@/components/ui/button";
import { Info, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
  form: UseFormReturn<ProductFormData>;
  initialImages?: string[];
}

export function ProductImages({ form, initialImages }: ProductImagesProps) {
  const [isDragging, setIsDragging] = useState(false);
  const {
    images,
    uploadingImg,
    handleImageUpload,
    handleDrop,
    handleDragOver,
    handleRemoveImage,
    handleReplaceImage,
    fileInputRef,
  } = useImageUpload({
    form,
    initialImages,
  });

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropWrapper = async (e: React.DragEvent<HTMLLabelElement>) => {
    setIsDragging(false);
    await handleDrop(e);
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-background">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">Gambar Produk</h2>
        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <label
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg aspect-square transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-input hover:bg-accent/50"
          }`}
          onDrop={handleDropWrapper}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center text-center justify-center p-4">
            <svg
              className={`w-6 h-6 mb-2 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-primary font-medium text-sm">Klik untuk unggah</span>
            <span className="text-muted-foreground text-xs mt-1">atau seret dan lepas</span>
          </div>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            disabled={uploadingImg}
          />
        </label>

        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg border border-input bg-background overflow-hidden group"
          >
            <Image
              src={image}
              alt={`Gambar produk ${index + 1}`}
              fill
              className="object-contain p-2"
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-background/80 backdrop-blur-sm hover:bg-accent"
                onClick={() => handleRemoveImage(index)}
              >
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>

      {form.formState.errors.imageUrls?.message && (
        <p className="text-sm text-destructive mt-1">
          {form.formState.errors.imageUrls.message}
        </p>
      )}
    </div>
  );
}
