// src/components/shopping-cart.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/useCartStore";
import { XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const ShoppingCart = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleIncreaseQuantity = (productId: string) => {
    increaseQuantity(productId);
  };

  const handleDecreaseQuantity = (productId: string) => {
    decreaseQuantity(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
          <CardDescription>Your cart is empty.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Add items to your cart to proceed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full max-h-[80vh] flex flex-col">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
        <CardDescription>{cartItems.length} items in your cart</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md aspect-square object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncreaseQuantity(item.productId)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.productId)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t py-4">
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <Button
          variant="destructive"
          onClick={handleClearCart}
          className="w-full"
        >
          Clear Cart
        </Button>
        <Button className="w-full">Checkout</Button>
      </CardFooter>
    </Card>
  );
};

export default ShoppingCart;
