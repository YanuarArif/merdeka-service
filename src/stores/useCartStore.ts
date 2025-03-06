import { create } from "zustand";
import { CartSlice } from "@/types/cart";
import { createCartItemsSlice, initializeCart } from "./slices/cartItemsSlice";
import { createCartActionsSlice } from "./slices/cartActionsSlice";

export const useCartStore = create<CartSlice>((set, get) => ({
  ...createCartItemsSlice(set, get),
  ...createCartActionsSlice(set, get),
}));

// Initialize cart from database on app startup
if (typeof window !== "undefined") {
  // Check if user is logged in before initializing cart
  const isLoggedIn = document.cookie.includes("next-auth.session-token");
  if (isLoggedIn) {
    initializeCart(useCartStore.setState);
  }
}

// Subscribe to changes and sync with database
useCartStore.subscribe((state) => {
  if (typeof window !== "undefined") {
    const isLoggedIn = document.cookie.includes("next-auth.session-token");
    if (isLoggedIn) {
      // You might want to debounce this in a real application
      console.log("Cart updated:", state);
    }
  }
});

export { useCartStore as cartStore };
