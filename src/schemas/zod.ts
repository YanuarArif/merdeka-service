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
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  description: z.string().min(1, { message: "Deskripsi wajib diisi" }),
  price: z.coerce.number(),
  category: z.string(),
  imageUrl: z.string().optional(),
});
