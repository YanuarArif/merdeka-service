import { StateCreator } from "zustand";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: () => number;
  getTotalPrice: () => number;
}

export interface CartActionsSlice {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
}

// define typess for slices to be used in create<>()
export type CartSlice = CartState & CartActionsSlice;
export type CartItemsSliceType = StateCreator<CartSlice, [], [], CartState>;
export type CartActionsSliceType = StateCreator<
  CartSlice,
  [],
  [],
  CartActionsSlice
>;
