"use client";

import { CartWithItems } from "@/types/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface CartListProps {
  cart: CartWithItems;
}

export function CartList({ cart }: CartListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      setLoading(itemId);
      setError(null);

      const response = await fetch(`/api/cart/${cart.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartItemId: itemId,
          quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update quantity");
      }

      // Refresh the page to show updated cart
      window.location.reload();
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
    } finally {
      setLoading(null);
    }
  }

  async function removeItem(itemId: string) {
    try {
      setLoading(itemId);
      setError(null);

      const response = await fetch(`/api/cart/${cart.id}?itemId=${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to remove item");
      }

      // Refresh the page to show updated cart
      window.location.reload();
    } catch (error) {
      console.error("Error removing item:", error);
      setError(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    } finally {
      setLoading(null);
    }
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex items-center gap-4">
                  {item.product.imageUrls?.[0] && (
                    <Image
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="rounded-md"
                    />
                  )}
                  <span>{item.product.name}</span>
                </TableCell>
                <TableCell>{formatCurrency(Number(item.price))}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading === item.id}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading === item.id}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(item.price) * item.quantity)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={loading === item.id}
                  >
                    {loading === item.id ? "Removing..." : "Remove"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">
                Total:
              </TableCell>
              <TableCell className="font-bold">
                {formatCurrency(totalPrice)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
