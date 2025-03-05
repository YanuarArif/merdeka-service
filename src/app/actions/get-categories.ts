// @/app/actions/get-categories.ts
"use server";

import { database } from "@/lib/database";

export async function getCategories() {
  try {
    // Fetch distinct main categories
    const mainCategories = await database.product.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      where: {
        category: {
          not: null,
        },
      },
    });

    // Fetch distinct subcategories
    const subCategories = await database.product.findMany({
      select: {
        subCategory: true,
      },
      distinct: ["subCategory"],
      where: {
        subCategory: {
          not: null,
        },
      },
    });

    // Transform into { label, value, isSubCategory } format
    const categoryOptions = [
      ...mainCategories.map((cat) => ({
        label: cat.category!,
        value: cat.category!.toLowerCase().replace(/\s+/g, "-"),
        isSubCategory: false,
      })),
      ...subCategories.map((cat) => ({
        label: cat.subCategory!,
        value: cat.subCategory!.toLowerCase().replace(/\s+/g, "-"),
        isSubCategory: true,
      })),
    ].filter((cat) => cat.label); // Ensure no empty categories

    return categoryOptions;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function addCategory(
  name: string,
  isSubCategory: boolean = false
) {
  try {
    // Create a placeholder product with this category
    const result = await database.product.create({
      data: {
        name: `${name} Category Placeholder`,
        price: 0,
        [isSubCategory ? "subCategory" : "category"]: name,
        imageUrls: [],
        user: {
          create: {
            name: "System",
            email: `system-${Date.now()}@placeholder.com`,
            emailVerified: new Date(),
            role: "ADMIN",
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding category:", error);
    return { error: "Failed to add category" };
  }
}
