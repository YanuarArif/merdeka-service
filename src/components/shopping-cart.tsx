// src/components/shopping-cart.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, X } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";

const ShoppingCart = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const route = useRouter();

  if (cartItems.length === 0) {
    return (
      <Card className="w-full p-6 text-center bg-white shadow-sm rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Keranjang Kamu</h2>
        <p className="mt-2 text-gray-500">Keranjang kamu Kosong.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Keranjang Kamu
      </h2>
      <Separator className="w-full mb-2" />
      <div className="flex-grow space-y-1">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border-b pb-2 last:border-1"
          >
            <div className="flex items-center space-x-4">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              )}
              <div>
                <p className="text-gray-800 font-semibold text-sm">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600 font-light">
                  {formatCurrency(item.price)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => decreaseQuantity(item.productId)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-sm text-gray-700">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => increaseQuantity(item.productId)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-600"
              onClick={() => removeItem(item.productId)}
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-lg font-semibold text-gray-800">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <Button
          variant="outline"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
        <Button
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={() => route.push("/dashboard/cart")}
        >
          Checkout
        </Button>
      </div>
    </Card>
  );
};

export default ShoppingCart;
