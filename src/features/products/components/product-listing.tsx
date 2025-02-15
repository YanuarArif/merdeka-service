import { Product } from "@/constants/data";
import { database as prisma } from "@/lib/database";
import { searchParamsCache } from "@/lib/searchparams";
import { DataTable as ProductTable } from "@/components/ui/table/data-table";
import { columns } from "./product-tables/columns";

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const categories = searchParamsCache.get("categories");

  const currentPage =
    typeof page === "string" ? parseInt(page) : page ? page : 1;
  const limitVal =
    typeof pageLimit === "string"
      ? parseInt(pageLimit)
      : pageLimit
        ? pageLimit
        : 10;
  const skip = (currentPage - 1) * limitVal;

  const filterWhere = {
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(categories ? { categories: { hasSome: categories.split(",") } } : {}),
  };

  const products = await prisma.product.findMany({
    where: filterWhere,
    skip,
    take: limitVal,
  });

  const totalProducts = await prisma.product.count({ where: filterWhere });

  // Map the returned products to match the expected Product type shape if needed
  const mappedProducts: Product[] = products.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    imageUrl: p.imageUrl,
    photo_url: p.imageUrl, // mapping imageUrl to photo_url
    category: p.category,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }));

  return (
    <ProductTable
      columns={columns}
      data={mappedProducts}
      totalItems={totalProducts}
    />
  );
}
