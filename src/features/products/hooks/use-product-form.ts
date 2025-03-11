// src/hooks/use-product-form.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Product } from "@/types/product";
import { useEffect } from "react";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const productFormSchema = z.object({
  images: z
    .custom<File[]>()
    .optional()
    .default([])
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
  imageUrls: z.array(z.string()).min(1, "At least one image is required"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const useProductForm = (initialData: Product | null) => {
  const defaultValues: ProductFormData = {
    name: initialData?.name || "",
    category: initialData?.category || "",
    subCategory: initialData?.subCategory || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    imageUrls: initialData?.imageUrls || [],
    weight: initialData?.weight || undefined,
    length: initialData?.length || undefined,
    breadth: initialData?.breadth || undefined,
    width: initialData?.width || undefined,
    stock: initialData?.stock || 0,
    sku: initialData?.sku || "",
    images: [], // New images uploaded during editing
  };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onChange", // Ensure isDirty updates on every change
  });

  // Reset form with initial data when initialData changes (e.g., if editing a different product)
  useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form]);

  return form;
};
