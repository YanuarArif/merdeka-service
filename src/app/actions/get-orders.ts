"use server";

import { database } from "@/lib/database";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  ShippingAddress,
} from "@/types/order";
import { auth } from "@/lib/auth";

export async function getOrders() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Not authenticated" };
  }

  try {
    console.log("Fetching orders for user:", userId);

    // First check if user has any orders
    const orderCount = await database.order.count({
      where: { userId },
    });

    console.log("Total orders found:", orderCount);

    if (orderCount === 0) {
      return { orders: [] };
    }

    const orders = await database.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Raw database orders:", JSON.stringify(orders, null, 2));
    const mappedOrders: Order[] = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as OrderStatus,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        product: {
          ...item.product,
          price: Number(item.product.price),
          createdAt: new Date(item.product.createdAt),
          updatedAt: new Date(item.product.updatedAt),
        },
        quantity: item.quantity,
        price: Number(item.price),
      })),
      userId: order.userId,
      shippingAddress: order.shippingAddress as unknown as ShippingAddress,
      paymentStatus: order.paymentStatus as PaymentStatus,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    }));

    console.log("Mapped orders:", JSON.stringify(mappedOrders, null, 2));
    return { orders: mappedOrders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (error instanceof Error) {
      return { error: `Failed to fetch orders: ${error.message}` };
    }
    return { error: "Failed to fetch orders." };
  }
}
