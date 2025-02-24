"use server";

import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";
import { database } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export const createProduct = async (values: z.infer<typeof ProductSchema>) => {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: "Unauthorized - Please login first" };
    }

    const validatedFields = ProductSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors };
    }

    const {
      name,
      description,
      price,
      stock,
      imageUrl, // Expecting a single URL from the form
      category, // Updated field
      subCategory, // Updated field
      weight,
      length,
      breadth,
      width,
      sku,
    } = validatedFields.data;

    // Get user ID from email
    const user = await database.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    await database.product.create({
      data: {
        name,
        description,
        price,
        stock: stock || 0, // Default to 0 if not provided
        imageUrl, // Single URL
        category: category || undefined, // Ensure null if empty
        subCategory: subCategory || undefined, // Ensure null if empty
        weight: weight || undefined,
        length: length || undefined,
        breadth: breadth || undefined,
        width: width || undefined,
        sku: sku || undefined,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: "Produk berhasil ditambahkan" };
  } catch (error: any) {
    console.error("Gagal membuat produk:", error);
    return { error: "Gagal membuat produk, silahkan coba lagi" };
  }
};
