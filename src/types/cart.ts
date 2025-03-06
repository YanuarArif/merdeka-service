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
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export type CartSlice = CartState & CartActionsSlice;

export type CartStore = {
  state: CartState;
  actions: CartActionsSlice;
};

export type BoundCartState = StateCreator<CartSlice>;
export type CartItemsSliceType = (set: any, get: any) => CartState;
export type CartActionsSliceType = (set: any, get: any) => CartActionsSlice;
