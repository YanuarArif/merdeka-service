"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Package, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-500",
  [OrderStatus.PROCESSING]: "bg-blue-500",
  [OrderStatus.SHIPPED]: "bg-purple-500",
  [OrderStatus.DELIVERED]: "bg-green-500",
  [OrderStatus.CANCELLED]: "bg-red-500",
};

const statusIconMap: Record<OrderStatus, React.ReactNode> = {
  [OrderStatus.PENDING]: <ShoppingCart className="h-3 w-3 mr-1" />,
  [OrderStatus.PROCESSING]: <Package className="h-3 w-3 mr-1" />,
  [OrderStatus.SHIPPED]: <Truck className="h-3 w-3 mr-1" />,
  [OrderStatus.DELIVERED]: <Package className="h-3 w-3 mr-1" />,
  [OrderStatus.CANCELLED]: <Package className="h-3 w-3 mr-1" />,
};

const paymentStatusColorMap: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "bg-yellow-500",
  [PaymentStatus.PAID]: "bg-green-500",
  [PaymentStatus.FAILED]: "bg-red-500",
  [PaymentStatus.REFUNDED]: "bg-purple-500",
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "orderNumber",
    accessorKey: "orderNumber",
    header: "Order Number",
    cell: ({ row }) => {
      const orderNumber = row.getValue("orderNumber") as string;
      return <div className="font-medium">#{orderNumber}</div>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return (
        <Badge
          className={`${statusColorMap[status]} text-white inline-flex items-center`}
        >
          {statusIconMap[status]}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as PaymentStatus;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge className={`${paymentStatusColorMap[status]} text-white`}>
                {status}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Payment {status.toLowerCase()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "items",
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const itemsList = items
        .map((item) => `${item.quantity}x ${item.product.name}`)
        .join("\n");

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-sm">{totalItems} items</span>
            </TooltipTrigger>
            <TooltipContent>
              <pre className="whitespace-pre text-sm">{itemsList}</pre>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "totalAmount",
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span>{format(date, "PP")}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(date, "PPpp")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
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
  console.log("OrderList component rendering with:", {
    ordersLength: orders.length,
    firstOrder: orders[0],
    orderStatus: orders.map((order) => order.status),
    columns: columns.map((col) => ({
      id: col.id,
      accessorKey: "accessorKey" in col ? col.accessorKey : undefined,
    })),
  });

  return <DataTable<Order, any> columns={columns} data={orders} />;
}
