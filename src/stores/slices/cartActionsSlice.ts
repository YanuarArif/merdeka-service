import { CartItem, CartActionsSliceType, CartSlice } from "@/types/cart";

interface CartResponse {
  id: string;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      imageUrls?: string[];
    };
    price: number;
    quantity: number;
  }>;
}

const fetchConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials,
};

export const createCartActionsSlice: CartActionsSliceType = (set, get) => ({
  addItem: async (item: CartItem) => {
    try {
      const response = await fetch("/api/cart", {
        ...fetchConfig,
        method: "POST",
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
        }),
      });

      if (response.status === 401) {
        throw new Error("Please login to add items to cart");
      }
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      // Refetch cart to update state
      const cartResponse = await fetch("/api/cart", {
        ...fetchConfig,
        method: "GET",
      });

      if (!cartResponse.ok) throw new Error("Failed to fetch updated cart");

      const cart: CartResponse = await cartResponse.json();

      set({
        items: cart.items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.product.imageUrls?.[0],
        })),
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to add item to cart");
    }
  },

  removeItem: async (productId: string) => {
    try {
      // First get the cart to find the cartId
      const cartResponse = await fetch("/api/cart", {
        ...fetchConfig,
        method: "GET",
      });

      if (!cartResponse.ok) throw new Error("Failed to fetch cart");

      const cart: CartResponse = await cartResponse.json();

      // Find the cart item with the matching productId
      const cartItem = cart.items.find((item) => item.product.id === productId);
      if (!cartItem) return;

      // Delete the cart item
      const response = await fetch(
        `/api/cart/${cart.id}?itemId=${cartItem.id}`,
        {
          ...fetchConfig,
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove item from cart");

      // Update local state
      set((state: CartSlice) => ({
        ...state,
        items: state.items.filter(
          (item: CartItem) => item.productId !== productId
        ),
      }));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  },

  increaseQuantity: async (productId: string) => {
    try {
      // First get the cart to find the cartId and current quantity
      const cartResponse = await fetch("/api/cart", {
        ...fetchConfig,
        method: "GET",
      });

      if (!cartResponse.ok) throw new Error("Failed to fetch cart");

      const cart: CartResponse = await cartResponse.json();

      // Find the cart item with the matching productId
      const cartItem = cart.items.find((item) => item.product.id === productId);
      if (!cartItem) return;

      // Update the quantity
      const response = await fetch(`/api/cart/${cart.id}`, {
        ...fetchConfig,
        method: "PUT",
        body: JSON.stringify({
          cartItemId: cartItem.id,
          quantity: cartItem.quantity + 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to increase quantity");

      // Update local state
      set((state: CartSlice) => ({
        ...state,
        items: state.items.map((item: CartItem) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  },

  decreaseQuantity: async (productId: string) => {
    try {
      // First get the cart to find the cartId and current quantity
      const cartResponse = await fetch("/api/cart", {
        ...fetchConfig,
        method: "GET",
      });

      if (!cartResponse.ok) throw new Error("Failed to fetch cart");

      const cart: CartResponse = await cartResponse.json();

      // Find the cart item with the matching productId
      const cartItem = cart.items.find((item) => item.product.id === productId);
      if (!cartItem) return;

      // If quantity would go to 0, remove the item instead
      if (cartItem.quantity <= 1) {
        await get().removeItem(productId);
        return;
      }

      // Update the quantity
      const response = await fetch(`/api/cart/${cart.id}`, {
        ...fetchConfig,
        method: "PUT",
        body: JSON.stringify({
          cartItemId: cartItem.id,
          quantity: cartItem.quantity - 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to decrease quantity");

      // Update local state
      set((state: CartSlice) => ({
        ...state,
        items: state.items.map((item: CartItem) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  },

  clearCart: async () => {
    try {
      // First get the cart to find the cartId
      const cartResponse = await fetch("/api/cart", {
        ...fetchConfig,
        method: "GET",
      });

      if (!cartResponse.ok) throw new Error("Failed to fetch cart");

      const cart: CartResponse = await cartResponse.json();

      // Clear the cart
      const response = await fetch(`/api/cart/${cart.id}`, {
        ...fetchConfig,
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to clear cart");

      // Update local state
      set({ items: [] });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },
});
