import Carousel from "../../components/carousel";
import ProductGrid from "../../components/productgrid1";
import { ModeToggle } from "../../components/themetoggle";

const HalamanDepan = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <Carousel />
      <ProductGrid />
    </main>
  );
};

export default HalamanDepan;
