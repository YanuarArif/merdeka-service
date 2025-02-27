// @/app/actions/get-categories.ts
"use server";

import { database } from "@/lib/database";

export async function getCategories() {
  try {
    // Fetch distinct categories from the Product table
    const categories = await database.product.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      where: {
        category: {
          not: null, // Exclude null categories
        },
      },
    });

    // Transform into { label, value } format
    const categoryOptions = categories
      .map((cat) => ({
        label: cat.category!,
        value: cat.category!.toLowerCase().replace(/\s+/g, "-"),
      }))
      .filter((cat) => cat.label); // Ensure no empty categories

    return categoryOptions;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
