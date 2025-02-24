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

  const user = await database.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const page = Number(searchParamsCache.get("page") || "1");
  const search = searchParamsCache.get("q");
  const pageLimit = Number(searchParamsCache.get("limit") || "10");
  const categories = searchParamsCache.get("categories");

  const categoryArray = categories ? categories.split(".") : [];

  const totalProducts = await database.product.count({
    where: {
      userId: user.id,
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      ...(categoryArray.length > 0
        ? {
            OR: [
              { category: { in: categoryArray } },
              { subCategory: { in: categoryArray } },
            ],
          }
        : {}),
    },
  });

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
      ...(categoryArray.length > 0
        ? {
            OR: [
              { category: { in: categoryArray } },
              { subCategory: { in: categoryArray } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const products: Product[] = dbProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description || null,
    price: product.price.toNumber(),
    stock: product.stock,
    imageUrl: product.imageUrl || null,
    category: product.category || "",
    subCategory: product.subCategory || undefined,
    weight: product.weight || null,
    length: product.length || null,
    breadth: product.breadth || null,
    width: product.width || null,
    sku: product.sku || null,
    attributes: product.attributes as Record<string, any> | null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    userId: product.userId,
  }));

  return (
    <TableListProduct
      data={products}
      totalItems={totalProducts}
      pageSizeOptions={[10, 20, 30, 40, 50]}
    />
  );
}
