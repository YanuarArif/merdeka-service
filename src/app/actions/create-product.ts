"use server";

import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";
import { database } from "@/lib/database";
import { revalidatePath } from "next/cache";

export const createProduct = async (values: z.infer<typeof ProductSchema>) => {
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, description, price, category, imageUrl } = validatedFields.data;

  try {
    await database.product.create({
      data: {
        name,
        description,
        price,
        category,
        imageUrl,
      },
    });

    revalidatePath("/dashboard/product");
    return { success: "Produk berhasil ditambahkan" };
  } catch (error: any) {
    console.error("Gagal membuat produk:", error);
    return { error: "Gagal membuat produk, silahkan coba lagi" };
  }
};
