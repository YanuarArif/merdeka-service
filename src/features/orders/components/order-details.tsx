"use client";

import { Card } from "@/components/ui/card";
import { OrderStatus, PaymentStatus, type Order } from "@/types/order";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PaymentSection } from "./payment-section";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  CreditCard,
  Hash,
  Home,
  Package2,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-500",
  [OrderStatus.PROCESSING]: "bg-blue-500",
  [OrderStatus.SHIPPED]: "bg-purple-500",
  [OrderStatus.DELIVERED]: "bg-green-500",
  [OrderStatus.CANCELLED]: "bg-red-500",
};

const statusIconMap: Record<OrderStatus, JSX.Element> = {
  [OrderStatus.PENDING]: <Package2 className="h-4 w-4" />,
  [OrderStatus.PROCESSING]: <Package2 className="h-4 w-4" />,
  [OrderStatus.SHIPPED]: <Truck className="h-4 w-4" />,
  [OrderStatus.DELIVERED]: <Package2 className="h-4 w-4 text-green-500" />,
  [OrderStatus.CANCELLED]: <Package2 className="h-4 w-4 text-red-500" />,
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
    <div className="flex flex-col space-y-8">
      {/* Order Summary Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 transition-shadow hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Order Number
              </p>
              <p className="text-lg font-semibold">{order.orderNumber}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-shadow hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg font-semibold">
                {format(new Date(order.createdAt), "PPP")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-shadow hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Amount
              </p>
              <p className="text-lg font-semibold">{formattedTotal}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-shadow hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Payment Status
              </p>
              <Badge
                className={`${paymentStatusColorMap[order.paymentStatus]} text-white`}
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Status */}
        <Card className="p-6 transition-shadow hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {statusIconMap[order.status]}
              <h3 className="text-lg font-semibold">Order Status</h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${statusColorMap[order.status]} text-white`}>
                {order.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(order.updatedAt), "PPP")}
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Section */}
        <PaymentSection order={order} />
      </div>

      {/* Shipping Information */}
      <Card className="p-6 transition-shadow hover:shadow-md">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Shipping Address</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{order.shippingAddress.fullName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card className="p-6 transition-shadow hover:shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Order Items</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.items.length} items
            </p>
          </div>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{item.product.name}</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <p>
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(item.price / item.quantity)}{" "}
                              × {item.quantity}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unit price × Quantity</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.price)}
                    </p>
                  </div>
                  {index < order.items.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
