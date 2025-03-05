import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../hooks/use-product-form";
import { useImageUpload } from "../hooks/use-image-upload";
import { Button } from "@/components/ui/button";
import { Info, Upload } from "lucide-react";
import Image from "next/image";

interface ProductImagesProps {
  form: UseFormReturn<ProductFormData>;
  initialImages?: string[];
}

export function ProductImages({ form, initialImages }: ProductImagesProps) {
  const {
    images,
    uploadingImg,
    handleImageUpload,
    handleDrop,
    handleDragOver,
    handleRemoveImage,
  } = useImageUpload({
    form,
    initialImages,
  });

  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">Product Images</h2>
        <Info className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 cursor-pointer min-h-[120px]"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 text-center">
            {uploadingImg
              ? "Uploading..."
              : "Click to upload or drag and drop (multiple allowed)"}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            disabled={uploadingImg}
          />
        </label>
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square max-w-full">
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              fill
              className="object-contain rounded-lg border border-gray-200 max-h-[120px]"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveImage(index)}
                className="bg-white text-gray-600 hover:text-primary"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      {form.formState.errors.imageUrls?.message && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors.imageUrls.message}
        </p>
      )}
    </div>
  );
}
