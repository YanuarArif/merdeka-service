"use server";

import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";
import { database } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export const updateProduct = async (
  productId: string,
  values: z.infer<typeof ProductSchema>
) => {
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
      imageUrls,
      category,
      subCategory,
      weight,
      length,
      breadth,
      width,
      sku,
    } = validatedFields.data;

    const user = await database.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Fetch existing product to preserve imageUrl if not provided
    const existingProduct = await database.product.findUnique({
      where: { id: productId, userId: user.id },
      select: { imageUrls: true },
    });

    if (!existingProduct) {
      return { error: "Product not found" };
    }

    await database.product.update({
      where: { id: productId, userId: user.id },
      data: {
        name,
        description: description || null, // Prisma allows null
        price,
        stock: stock || 0,
        imageUrls: imageUrls || existingProduct.imageUrls || null, // Preserve or allow null
        category: category || null, // Prisma allows null, though form requires it
        subCategory: subCategory || null,
        weight: weight || null,
        length: length || null,
        breadth: breadth || null,
        width: width || null,
        sku: sku || null,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: "Produk berhasil diperbarui" };
  } catch (error: any) {
    console.error("Gagal memperbarui produk:", error);
    return { error: "Gagal memperbarui produk, silahkan coba lagi" };
  }
};
