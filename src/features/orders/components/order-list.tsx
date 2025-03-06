"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-500",
  [OrderStatus.PROCESSING]: "bg-blue-500",
  [OrderStatus.SHIPPED]: "bg-purple-500",
  [OrderStatus.DELIVERED]: "bg-green-500",
  [OrderStatus.CANCELLED]: "bg-red-500",
};

const paymentStatusColorMap: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "bg-yellow-500",
  [PaymentStatus.PAID]: "bg-green-500",
  [PaymentStatus.FAILED]: "bg-red-500",
  [PaymentStatus.REFUNDED]: "bg-purple-500",
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return (
        <Badge className={`${statusColorMap[status]} text-white`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as PaymentStatus;
      return (
        <Badge className={`${paymentStatusColorMap[status]} text-white`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "PPP");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/orders/${order.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <DataTable<Order, any>
      columns={columns}
      data={orders}
      totalItems={orders.length}
    />
  );
}
