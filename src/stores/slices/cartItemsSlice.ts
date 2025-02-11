import { StateCreator } from "zustand";
import { CartItemsSliceType, CartSlice } from "@/types/cart";

export const createCartItemsSlice: CartItemsSliceType = (set, get) => ({
  items: [],
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
  // No setters in this slice, they go to cartActionsSlice
});
