"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

export function CartList() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const columns = useMemo<ColumnDef<CartItem, unknown>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Product",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 relative rounded-md overflow-hidden">
                <Image
                  src={item.image || "/images/laptops/lenovo-laptop.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {item.productId}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const price = parseFloat(row.getValue("price"));
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(price);
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => decreaseQuantity(item.productId)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => increaseQuantity(item.productId)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "subtotal",
        header: "Subtotal",
        cell: ({ row }) => {
          const item = row.original;
          const subtotal = item.price * item.quantity;
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(subtotal);
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.productId)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [increaseQuantity, decreaseQuantity, removeItem]
  );

  return (
    <DataTable<CartItem, unknown>
      columns={columns}
      data={items}
      totalItems={items.length}
    />
  );
}
