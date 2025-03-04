import ProductDetail from "@/components/product-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Detail",
  description: "View product details",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const resolvedParams = await params;

  return (
    <ProductDetail
      maincategory={resolvedParams.category}
      nameproduct={decodeURIComponent(resolvedParams.product)}
    />
  );
}
