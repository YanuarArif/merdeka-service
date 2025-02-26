import ProductDetail from "@/components/product-detail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Await the params Promise
  return <ProductDetail productId={id} />;
}
