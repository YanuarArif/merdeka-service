"use client";

import { createProduct } from "@/app/actions/create-product";
import { updateProduct } from "@/app/actions/update-product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ArrowLeft, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, DragEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { put } from "@vercel/blob";
import { Product } from "@/types/product";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const CATEGORY_OPTIONS = [
  { label: "Health & Medicine", value: "health" },
  { label: "Beauty", value: "beauty" },
  { label: "Electronics", value: "electronics" },
  { label: "Laptop", value: "laptop" },
  { label: "Home & Garden", value: "home" },
];

const formSchema = z.object({
  images: z
    .custom<File[]>()
    .optional()
    .default([])
    .refine(
      (files) => files.length <= 1,
      "Only one image can be uploaded at a time"
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB`
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      ".jpg, .jpeg, .png and .webp files are accepted"
    ),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  weight: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  breadth: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).default(0),
  sku: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || "",
    category: initialData?.category || "",
    subCategory: initialData?.subCategory || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    imageUrls: initialData?.imageUrl ? [initialData.imageUrl] : [],
    weight: initialData?.weight || undefined,
    length: initialData?.length || undefined,
    breadth: initialData?.breadth || undefined,
    width: initialData?.width || undefined,
    stock: initialData?.stock || 0,
    sku: initialData?.sku || "",
    images: [],
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [uploadingImg, setUploadingImg] = useState(false);
  const [images, setImages] = useState<string[]>(defaultValues.imageUrls);
  const [customCategory, setCustomCategory] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleFileUpload = async (file: File) => {
    setUploadingImg(true);
    try {
      const currentFiles = form.getValues("images") || [];
      form.setValue("images", [file], { shouldValidate: true });
      const blob = await put(file.name, file, {
        access: "public",
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });
      const newImageUrl = blob.url;
      setImages([newImageUrl]);
      form.setValue("imageUrls", [newImageUrl], { shouldValidate: true });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    const currentUrls = form.getValues("imageUrls") || [];
    form.setValue(
      "imageUrls",
      currentUrls.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
    const currentFiles = form.getValues("images") || [];
    form.setValue(
      "images",
      currentFiles.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const handleDescriptionFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue("description", text);
      };
      reader.readAsText(file);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      form.setValue("subCategory", customCategory);
      setCustomCategory("");
    }
  };

  async function onSubmit(values: FormData) {
    startTransition(async () => {
      try {
        // Ensure imageUrlToUse is string | undefined, not null
        const imageUrlToUse =
          values.imageUrls?.[0] ||
          (initialData ? initialData.imageUrl ?? undefined : undefined);

        if (!initialData && !imageUrlToUse) {
          toast.error("An image is required for new products");
          return;
        }

        const result = initialData
          ? await updateProduct(initialData.id, {
              name: values.name,
              description: values.description || undefined,
              price: values.price,
              stock: values.stock || 0,
              imageUrl: imageUrlToUse, // Now correctly typed as string | undefined
              category: values.category,
              subCategory: values.subCategory || undefined,
              weight: values.weight || undefined,
              length: values.length || undefined,
              breadth: values.breadth || undefined,
              width: values.width || undefined,
              sku: values.sku || undefined,
            })
          : await createProduct({
              name: values.name,
              description: values.description || undefined,
              price: values.price,
              stock: values.stock || 0,
              imageUrl: imageUrlToUse,
              category: values.category,
              subCategory: values.subCategory || undefined,
              weight: values.weight || undefined,
              length: values.length || undefined,
              breadth: values.breadth || undefined,
              width: values.width || undefined,
              sku: values.sku || undefined,
            });

        if (result?.error) {
          toast.error(result.error as string);
        } else if (result?.success) {
          toast.success(
            initialData
              ? "Product updated successfully"
              : "Product added successfully"
          );
          form.reset();
          router.push("/dashboard/products");
        }
      } catch (error) {
        toast.error("An error occurred while saving the product");
      }
    });
  }

  return (
    <div className="container max-w-full px-4 py-6 md:max-w-4xl lg:max-w-7xl space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
        <Link
          href="/shop"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          View Shop
        </Link>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8">
          {/* Left Column - Description and Shipping */}
          <div className="space-y-6">
            <div className="space-y-4 border p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium">Description</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="Enter product name"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description">Product Description</Label>
                    <Label
                      htmlFor="descriptionFile"
                      className="text-sm text-muted-foreground cursor-pointer hover:text-primary"
                    >
                      Upload .txt file
                      <input
                        type="file"
                        id="descriptionFile"
                        accept=".txt"
                        className="hidden"
                        onChange={handleDescriptionFileUpload}
                      />
                    </Label>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Enter product description (optional)"
                    className="min-h-[120px]"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 border p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium">Shipping and Delivery</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("weight")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length (in)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("length")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breadth">Breadth (in)</Label>
                  <Input
                    id="breadth"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("breadth")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (in)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("width")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Images, Categories, Inventory, Pricing */}
          <div className="space-y-6">
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
                      : "Click to upload or drag and drop"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                    disabled={uploadingImg}
                  />
                </label>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square max-w-full"
                  >
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
              {form.formState.errors.images?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.images?.message}
                </p>
              )}
            </div>

            <div className="space-y-4 border p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium">Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    {...form.register("category")}
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.category?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Sub Category</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    {...form.register("subCategory")}
                  >
                    <option value="">Select sub category (optional)</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.subCategory?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.subCategory.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add custom sub category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
                <Button onClick={handleAddCustomCategory}>Add</Button>
              </div>
            </div>

            <div className="space-y-4 border p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium">Inventory</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="Enter stock"
                    {...form.register("stock")}
                  />
                  {form.formState.errors.stock?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.stock.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sku">SKU (Optional)</Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    {...form.register("sku")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium">Pricing</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    {...form.register("price")}
                  />
                  {form.formState.errors.price?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={isPending || uploadingImg}>
          Discard
        </Button>
        <Button
          type="submit"
          disabled={isPending || uploadingImg}
          onClick={() => form.handleSubmit(onSubmit)()}
        >
          {isPending ? "Adding Product..." : "Add Product"}
        </Button>
      </div>
    </div>
  );
}
