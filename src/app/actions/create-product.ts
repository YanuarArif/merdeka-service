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

    const { name, description, price, categories, imageUrl } =
      validatedFields.data;

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
        categories,
        imageUrl,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/product");
    return { success: "Produk berhasil ditambahkan" };
  } catch (error: any) {
    console.error("Gagal membuat produk:", error);
    return { error: "Gagal membuat produk, silahkan coba lagi" };
  }
};
