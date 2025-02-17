import Carousel from "@/components/carousel";
import LaptopGrid from "@/components/productgrid1";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Carousel />
      <LaptopGrid />
    </main>
  );
}
