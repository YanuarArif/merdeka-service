interface Phone {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
}

export const phones: Phone[] = [
  {
    id: "s22-ultra",
    name: "Galaxy S22 Ultra",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HAfRR5EO4Q64R1kNqqaCxMGkrSG3St.png",
    originalPrice: 74999,
    discountedPrice: 32999,
    discount: 56,
  },
  {
    id: "m13",
    name: "Galaxy M13 (4GB | 64 GB)",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HAfRR5EO4Q64R1kNqqaCxMGkrSG3St.png",
    originalPrice: 14999,
    discountedPrice: 10499,
    discount: 56,
  },
  {
    id: "m33",
    name: "Galaxy M33 (4GB | 64 GB)",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HAfRR5EO4Q64R1kNqqaCxMGkrSG3St.png",
    originalPrice: 24999,
    discountedPrice: 16999,
    discount: 56,
  },
  {
    id: "m53",
    name: "Galaxy M53 (4GB | 64 GB)",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HAfRR5EO4Q64R1kNqqaCxMGkrSG3St.png",
    originalPrice: 40999,
    discountedPrice: 31999,
    discount: 50,
  },
  {
    id: "s22-ultra-green",
    name: "Galaxy S22 Ultra",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HAfRR5EO4Q64R1kNqqaCxMGkrSG3St.png",
    originalPrice: 18999,
    discountedPrice: 67999,
    discount: 56,
  },
];
