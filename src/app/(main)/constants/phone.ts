export interface Phone {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
}

export const phones: Phone[] = [
  {
    id: "s22-ultra",
    name: "Galaxy S22 Ultra",
    image: "/images/laptops/lenovo-laptop.jpg",
    price: 74999,
    rating: 4.5,
  },
  {
    id: "m13",
    name: "Galaxy M13 (4GB | 64 GB)",
    image: "/images/laptops/lenovo-laptop.jpg",
    price: 14999,
    rating: 4.0,
  },
  {
    id: "m33",
    name: "Galaxy M33 (4GB | 64 GB)",
    image: "/images/laptops/lenovo-laptop.jpg",
    price: 24999,
    rating: 4.5,
  },
  {
    id: "m53",
    name: "Galaxy M53 (4GB | 64 GB)",
    image: "/images/laptops/lenovo-laptop.jpg",
    price: 40999,
    rating: 4.0,
  },
  {
    id: "s22-ultra-green",
    name: "Galaxy S22 Ultra",
    image: "/images/laptops/lenovo-laptop.jpg",
    price: 18999,
    rating: 4.5,
  },
];
