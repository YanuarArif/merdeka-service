"use server";

import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";
import { database } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export const createProduct = async (values: z.infer<typeof ProductSchema>) => {
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, description, price, category, imageUrl } = validatedFields.data;

  try {
    // --------------------- ADDED LOGGING ---------------------
    console.log(
      "Server Action - createProduct: Attempting Vercel Blob upload..."
    );
    console.log(
      "Server Action - BLOB_READ_WRITE_TOKEN (before put):",
      process.env.BLOB_READ_WRITE_TOKEN
    ); // Log token right before put

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error(
        "Server Action - ERROR: BLOB_READ_WRITE_TOKEN is NOT defined in environment variables!"
      ); // Explicit error log if token is missing
    }

    const blobResult = await put(
      "product-images/" + Date.now() + "-" + name.replace(/\s+/g, "-") + ".jpg", // Customize filename if needed
      imageUrl as string, // Assuming imageUrl is the file data (you might need to adjust based on how you are getting the file data)
      {
        access: "public",
      }
    );

    console.log("Server Action - Vercel Blob put result:", blobResult); // Log the result of put
    const uploadedImageUrl = blobResult.url; // Extract URL from result
    // --------------------- END ADDED LOGGING ---------------------
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
