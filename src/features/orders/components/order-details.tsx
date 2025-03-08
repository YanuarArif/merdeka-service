"use client";

import { Card } from "@/components/ui/card";
import { OrderStatus, PaymentStatus, type Order } from "@/types/order";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PaymentSection } from "./payment-section";

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

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(order.totalAmount);

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Order Number
            </p>
            <p className="font-medium">{order.orderNumber}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="font-medium">
              {format(new Date(order.createdAt), "PPP")}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Amount
            </p>
            <p className="font-medium">{formattedTotal}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge className={`${statusColorMap[order.status]} text-white`}>
              {order.status}
            </Badge>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Payment Status
            </p>
            <Badge
              className={`${paymentStatusColorMap[order.paymentStatus]} text-white`}
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Add Payment Section */}
      <PaymentSection order={order} />

      <Card className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Shipping Address
          </p>
          <div className="space-y-1">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Items</p>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.price)}
                    </p>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
