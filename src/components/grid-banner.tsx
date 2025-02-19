import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    // name: "Jasa Service",
    // description: "We automatically save your files as you type.",
    href: "/",
    cta: "Jasa Service",
    className:
      "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 bg-laptop bg-cover bg-no-repeat bg-center relative overflow-hidden hover:before:scale-110 before:absolute before:inset-0 before:bg-laptop before:bg-cover before:bg-no-repeat before:bg-center before:transition-transform before:duration-500 before:ease-in-out before:content-['']",
  },
  {
    // name: "Smartphone",
    // description: "Search through all your files in one place.",
    href: "/",
    cta: "Smartphone",
    className:
      "lg:row-start-1 lg:row-end-1 lg:col-start-2 lg:col-end-3 bg-laptop bg-cover bg-no-repeat bg-center relative overflow-hidden hover:before:scale-110 before:absolute before:inset-0 before:bg-laptop before:bg-cover before:bg-no-repeat before:bg-center before:transition-transform before:duration-500 before:ease-in-out before:content-['']",
  },
  {
    // name: "Laptop",
    // description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Laptop",
    className:
      "col-start-1 col-end-5 lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-2 bg-laptop bg-cover bg-no-repeat bg-center relative overflow-hidden hover:before:scale-110 before:absolute before:inset-0 before:bg-laptop before:bg-cover before:bg-no-repeat before:bg-center before:transition-transform before:duration-500 before:ease-in-out before:content-['']",
  },
  {
    // name: "Printer",
    // description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Printer",
    className:
      "lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-2 bg-laptop bg-cover bg-no-repeat bg-center relative overflow-hidden hover:before:scale-110 before:absolute before:inset-0 before:bg-laptop before:bg-cover before:bg-no-repeat before:bg-center before:transition-transform before:duration-500 before:ease-in-out before:content-['']",
  },
  {
    // name: "Promo Hari Ini",
    // description:
    //   "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Promo Hari Ini",
    className:
      "lg:col-start-4 lg:col-end-4 lg:row-start-2 lg:row-end-2 bg-laptop bg-cover bg-no-repeat bg-center relative overflow-hidden hover:before:scale-110 before:absolute before:inset-0 before:bg-laptop before:bg-cover before:bg-no-repeat before:bg-center before:transition-transform before:duration-500 before:ease-in-out before:content-['']",
  },
];

export default function GridBanner() {
  return (
    <BentoGrid className="container mx-auto py-6 lg:grid-rows-2">
      {features.map((feature) => (
        <BentoCard key={feature.cta} {...feature} />
      ))}
    </BentoGrid>
  );
}
