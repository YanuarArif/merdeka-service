// @/app/actions/update-product.ts
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
      imageUrl,
      categories,
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

    await database.product.update({
      where: { id: productId, userId: user.id },
      data: {
        name,
        description,
        price,
        stock: stock || 0,
        imageUrl,
        categories: categories || undefined,
        weight: weight || undefined,
        length: length || undefined,
        breadth: breadth || undefined,
        width: width || undefined,
        sku: sku || undefined,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: "Produk berhasil diperbarui" };
  } catch (error: any) {
    console.error("Gagal memperbarui produk:", error);
    return { error: "Gagal memperbarui produk, silahkan coba lagi" };
  }
};
