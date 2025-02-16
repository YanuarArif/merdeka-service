import { Product } from "@/constants/data";
import { database } from "@/lib/database";
import { notFound, redirect } from "next/navigation";
import ProductForm from "./product-form";
import { auth } from "@/lib/auth";

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
    where: { email: session.user.email }
  });

  if (!user) {
    redirect("/auth/login");
  }

  let product = null;
  let pageTitle = "Create New Product";

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
      price: dbProduct.price,
      imageUrl: dbProduct.imageUrl || "",
      category: dbProduct.category || "",
      createdAt: dbProduct.createdAt.toISOString(),
      updatedAt: dbProduct.updatedAt.toISOString(),
    };

    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
