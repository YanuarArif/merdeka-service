// Define the Product interface to match ProductForm and Prisma schema
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrls?: string[];
  category: string;
  subCategory?: string;
  weight?: number | null;
  length?: number | null;
  breadth?: number | null;
  width?: number | null;
  sku?: string | null;
  attributes?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
