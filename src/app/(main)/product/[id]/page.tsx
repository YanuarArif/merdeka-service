import ProductDetail from "@/components/product-detail";

export default function ProductPage({ params }: { params: { productId: string } }) {
  return <ProductDetail productId={params.productId} />;
}
