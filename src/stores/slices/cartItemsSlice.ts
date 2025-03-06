import { CartItem, CartItemsSliceType } from "@/types/cart";

export const createCartItemsSlice: CartItemsSliceType = (set, get) => ({
  items: [],

  totalItems: () => {
    const { items } = get();
    return items.reduce(
      (sum: number, item: CartItem) => sum + item.quantity,
      0
    );
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );
  },
});

interface CartItemResponse {
  id: string;
  product: {
    id: string;
    name: string;
    imageUrls?: string[];
  };
  price: number | string;
  quantity: number;
}

interface CartResponse {
  id: string;
  items: CartItemResponse[];
}

// Initialize cart from API
export const initializeCart = async (
  setState: (state: { items: CartItem[] }) => void
) => {
  try {
    // Use absolute path for API route
    const response = await fetch("/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials for authentication
    });

    if (!response.ok) {
      console.error("Cart fetch failed:", response.status, response.statusText);
      throw new Error("Failed to fetch cart");
    }

    const cart: CartResponse = await response.json();

    // Transform cart items to match our local state structure
    const items =
      cart?.items?.map((item: CartItemResponse) => ({
        productId: item.product.id,
        name: item.product.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.product.imageUrls?.[0],
      })) || [];

    // Update local state
    setState({ items });
  } catch (error) {
    console.error("Error initializing cart:", error);
    setState({ items: [] });
  }
};
