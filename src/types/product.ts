export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}
