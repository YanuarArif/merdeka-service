import { Product } from "@/constants/data";
import { database } from "@/lib/database";
import { notFound } from "next/navigation";
import ProductForm from "./product-form";

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId,
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = "Create New Product";

  if (productId !== "new") {
    const dbProduct = await database.product.findUnique({
      where: {
        id: productId,
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
      price: dbProduct.price,
      imageUrl: dbProduct.imageUrl,
      category: dbProduct.category,
      createdAt: dbProduct.createdAt.toISOString(),
      updatedAt: dbProduct.updatedAt.toISOString(),
    };

    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
