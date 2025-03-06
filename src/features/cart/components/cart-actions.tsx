"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartActionsProps {
  cartId: string;
}

export function CartActions({ cartId }: CartActionsProps) {
  const [loading, setLoading] = useState<"clear" | "checkout" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function clearCart() {
    try {
      setLoading("clear");
      setError(null);

      const response = await fetch(`/api/cart/${cartId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to clear cart");
      }

      // Refresh the page to show empty cart
      window.location.reload();
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(error instanceof Error ? error.message : "Failed to clear cart");
    } finally {
      setLoading(null);
    }
  }

  async function checkout() {
    try {
      setLoading("checkout");
      setError(null);

      // Here you would implement checkout logic
      // For example, create an order from cart items
      router.push("/checkout");
    } catch (error) {
      console.error("Error during checkout:", error);
      setError(
        error instanceof Error ? error.message : "Failed to proceed to checkout"
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          variant="outline"
          onClick={clearCart}
          disabled={loading === "clear"}
        >
          {loading === "clear" ? "Clearing..." : "Clear Cart"}
        </Button>
        <Button onClick={checkout} disabled={loading === "checkout"}>
          {loading === "checkout" ? "Processing..." : "Proceed to Checkout"}
        </Button>
      </div>
    </div>
  );
}
