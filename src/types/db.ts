import {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
  Product,
} from "@prisma/client";

export type CartWithItems = PrismaCart & {
  items: (PrismaCartItem & {
    product: Product;
  })[];
};

export type CartItemWithProduct = PrismaCartItem & {
  product: Product;
};
