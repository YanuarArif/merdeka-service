import Carousel from "@/components/carousel";
import LaptopGrid from "@/components/productgrid1";
import GridBanner from "@/components/grid-banner";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Carousel />
      <LaptopGrid />
      <GridBanner />
    </main>
  );
}
