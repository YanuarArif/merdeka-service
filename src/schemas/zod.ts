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
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  stock: z
    .number()
    .int()
    .min(0, "Stock must be a non-negative integer")
    .optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(), // New main category
  subCategory: z.string().optional(), // New subcategory
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  breadth: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  sku: z.string().optional(),
});
