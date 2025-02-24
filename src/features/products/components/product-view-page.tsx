import { database } from "@/lib/database";
import { notFound, redirect } from "next/navigation";
import ProductForm from "./product-form";
import { auth } from "@/lib/auth";
import { Product } from "@/types/product";

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId,
}: TProductViewPageProps) {
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

  let product: Product | null = null;
  let pageTitle = "Tambah Produk Baru";

  if (productId !== "new") {
    const dbProduct = await database.product.findUnique({
      where: {
        id: productId,
        userId: user.id, // Only allow viewing user's own products
      },
    });

    if (!dbProduct) {
      notFound();
    }

    // Transform database product to match Product interface
    product = {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description || "",
      price: dbProduct.price.toNumber(), // Convert Decimal to number
      stock: dbProduct.stock, // Always a number due to Prisma default
      imageUrl: dbProduct.imageUrl || "",
      categories: dbProduct.categories
        ? Array.isArray(dbProduct.categories)
          ? (dbProduct.categories as string[]).filter(
              (cat): cat is string => typeof cat === "string"
            )
          : JSON.parse(dbProduct.categories as string) // Parse JSON if stored as string
        : [],
      weight: dbProduct.weight || null,
      length: dbProduct.length || null,
      breadth: dbProduct.breadth || null,
      width: dbProduct.width || null,
      sku: dbProduct.sku || null,
      attributes: dbProduct.attributes as Record<string, any> | null,
      createdAt: dbProduct.createdAt,
      updatedAt: dbProduct.updatedAt,
      userId: dbProduct.userId,
    };

    pageTitle = "Edit Product";
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
