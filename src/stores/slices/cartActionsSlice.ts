import { StateCreator } from "zustand";
import { CartActionsSliceType, CartItem, CartSlice } from "@/types/cart";

export const createCartActionsSlice: CartActionsSliceType = (set, get) => ({
  addItem: (item: CartItem) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex > -1) {
        // item already in cart, increase quantity
        const updatedItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
        return { items: updatedItems };
      } else {
        // item doesn't exist in cart, add new item
        return { items: [...state.items, item] };
      }
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  increaseQuantity: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));
  },
  decreaseQuantity: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
});
