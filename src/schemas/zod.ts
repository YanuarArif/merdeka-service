import { categories } from "@/app/(main)/constants/dropdownmenu";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export const DaftarSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export const ProductSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be non-negative").optional(),
  imageUrl: z.string().optional(), // Single URL for now
  categories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .optional(),
  weight: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  breadth: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  sku: z.string().optional(),
});
