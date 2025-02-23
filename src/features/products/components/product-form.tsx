"use client";

import { createProduct } from "@/app/actions/create-product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ArrowLeft, Info, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, DragEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length >= 1, "At least one image is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted"
    ),
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters",
  }),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  weight: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  breadth: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  quantity: z.coerce.number().min(0).optional(),
  sku: z.string().optional(),
  comparePrice: z.coerce.number().min(0).optional(),
  imageUrl: z.string().min(1, "Image URL is required").optional(),
});

export default function ProductForm({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || "",
    categories: initialData?.categories || [],
    price: initialData?.price || 0,
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    weight: 0,
    length: 0,
    breadth: 0,
    width: 0,
    quantity: 0,
    sku: "",
    comparePrice: 0,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [uploadingImg, setUploadingImg] = useState(false);
  const [images, setImages] = useState<string[]>(
    initialData?.imageUrl ? [initialData.imageUrl] : []
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleFileUpload = async (file: File) => {
    setUploadingImg(true);
    try {
      form.setValue("image", [file]);

      const blob = await put(file.name, file, {
        access: "public",
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });

      const newImageUrl = blob.url;
      setImages([newImageUrl]); // Replace existing images
      form.setValue("imageUrl", newImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleRemoveImage = () => {
    setImages([]);
    form.setValue("image", undefined);
    form.setValue("imageUrl", "");
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const result = await createProduct({
          ...values,
          categories: values.categories.join(","), // Convert array to comma-separated string
          imageUrl: values.imageUrl,
        });

        if (result?.error) {
          toast.error(result.error as string);
        } else if (result?.success) {
          toast.success("Product successfully added");
          form.reset();
          router.push("/dashboard/products");
        }
      } catch (error) {
        toast.error("An error occurred while adding the product");
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Description and Category */}
          <div className="space-y-6">
            <div className="space-y-4">
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
                    <Label htmlFor="description">Business Description</Label>
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
                    placeholder="Enter product description"
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

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Category</h2>
              <div className="space-y-4">
                <div>
                  <Label>Product Category</Label>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("categories", [value]);
                    }}
                    value={form.getValues("categories")[0] || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health & Medicine</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categories?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.categories.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Images and Other Details */}
          <div className="space-y-6">
            <div className="space-y-4">
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
                        onClick={() => handleImageUpload}
                        className="bg-white text-gray-600 hover:text-primary"
                      >
                        Replace
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="bg-white text-gray-600 hover:text-primary"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {form.formState.errors.image?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.image?.message?.toString()}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Shipping and Delivery</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <Label htmlFor="weight">Items Weight</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="0.00 kg"
                    {...form.register("weight")}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="0.00 in"
                    {...form.register("length")}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="breadth">Breadth</Label>
                  <Input
                    id="breadth"
                    type="number"
                    placeholder="0.00 in"
                    {...form.register("breadth")}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="0.00 in"
                    {...form.register("width")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Inventory</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    {...form.register("quantity")}
                  />
                  {form.formState.errors.quantity?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.quantity.message}
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

            <div className="space-y-4">
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
                <div>
                  <Label htmlFor="comparePrice">Compare at Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    placeholder="0.00"
                    {...form.register("comparePrice")}
                  />
                  {form.formState.errors.comparePrice?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.comparePrice.message}
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
