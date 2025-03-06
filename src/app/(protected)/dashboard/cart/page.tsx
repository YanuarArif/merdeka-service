"use client";

import { CartList } from "@/features/cart/components/cart-list";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { Heading } from "@/components/ui/heading";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between">
        <Heading
          title="Shopping Cart"
          description="Manage your cart items and proceed to checkout"
        />
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr,400px]">
        <div className="space-y-4">
          <Suspense fallback={<div>Loading cart items...</div>}>
            <CartList />
          </Suspense>
        </div>
        <div className="space-y-4">
          <Suspense fallback={<div>Loading summary...</div>}>
            <CartSummary />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
