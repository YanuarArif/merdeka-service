import { Product } from "@/types/product";
import { searchParamsCache } from "@/lib/searchparams";
import { database } from "@/lib/database";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TableListProduct } from "./product-tables/table-list-product";

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Get current user
  const user = await database.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Showcasing the use of search params cache in nested RSCs
  const page = Number(searchParamsCache.get("page") || "1");
  const search = searchParamsCache.get("q");
  const pageLimit = Number(searchParamsCache.get("limit") || "10");
  const categories = searchParamsCache.get("categories");

  // Get total count for pagination
  const totalProducts = await database.product.count({
    where: {
      userId: user.id,
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      ...(categories
        ? {
            categories: {
              array_contains: categories.split("."),
            },
          }
        : {}),
    },
  });

  // Get paginated products with filters
  const dbProducts = await database.product.findMany({
    skip: (page - 1) * pageLimit,
    take: pageLimit,
    where: {
      userId: user.id,
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      ...(categories
        ? {
            categories: {
              array_contains: categories.split("."),
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform database products to match Product interface
  const products: Product[] = dbProducts.map((product) => {
    let parsedCategories: string[] = [];
    if (product.categories) {
      if (Array.isArray(product.categories)) {
        parsedCategories = product.categories as string[];
      } else if (typeof product.categories === "string") {
        try {
          // Try parsing as JSON first
          parsedCategories = JSON.parse(product.categories);
          if (!Array.isArray(parsedCategories)) {
            // If parsed result isn’t an array, treat it as a comma-separated string
            parsedCategories = product.categories
              .split(",")
              .map((cat) => cat.trim());
          }
        } catch (e) {
          // If JSON.parse fails (e.g., "health,beauty"), split by comma
          parsedCategories = product.categories
            .split(",")
            .map((cat) => cat.trim());
        }
      }
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description || null,
      price: product.price.toNumber(),
      stock: product.stock,
      imageUrl: product.imageUrl || null,
      categories: parsedCategories,
      weight: product.weight || null,
      length: product.length || null,
      breadth: product.breadth || null,
      width: product.width || null,
      sku: product.sku || null,
      attributes: product.attributes || null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      userId: product.userId,
    };
  });

  return (
    <TableListProduct
      data={products}
      totalItems={totalProducts}
      pageSizeOptions={[10, 20, 30, 40, 50]}
    />
  );
}
