import Carousel from "@/components/carousel";
import ProductGrid from "@/components/productgrid1";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Carousel />
      <ProductGrid />
    </main>
  );
}
