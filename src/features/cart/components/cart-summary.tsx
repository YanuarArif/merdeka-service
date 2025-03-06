"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PackageOpen, Trash2 } from "lucide-react";

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.totalItems());
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <PackageOpen className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add some items to your cart to see them here
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cart Summary</h3>
        <Separator />
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Items</span>
            <span className="font-medium">{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              {formatCurrency(getTotalPrice())}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(getTotalPrice())}</span>
          </div>
        </div>
        <div className="space-y-3 pt-4">
          <Button className="w-full">Proceed to Checkout</Button>
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => clearCart()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
