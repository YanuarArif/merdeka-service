import { Product } from "@/constants/data";
import { searchParamsCache } from "@/lib/searchparams";
import { DataTable as ProductTable } from "@/components/ui/table/data-table";
import { columns } from "./product-tables/columns";
import { database } from "@/lib/database";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Get current user
  const user = await database.user.findUnique({
    where: { email: session.user.email }
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
      userId: user.id, // Only count user's products
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      category: categories ? { in: categories.split(".") } : undefined,
    },
  });

  // Get paginated products with filters
  const dbProducts = await database.product.findMany({
    skip: (page - 1) * pageLimit,
    take: pageLimit,
    where: {
      userId: user.id, // Only get user's products
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      category: categories ? { in: categories.split(".") } : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform database products to match Product interface
  const products: Product[] = dbProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description || null,
    price: product.price,
    imageUrl: product.imageUrl || null,
    category: product.category || null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
}
