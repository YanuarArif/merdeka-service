"use server";

import { database } from "@/lib/database";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";

export async function getOrders() {
  try {
    const orders = await database.order.findMany({
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
        },
        quantity: item.quantity,
        price: Number(item.price),
      })),
      userId: order.userId,
      shippingAddress: order.shippingAddress as any,
      paymentStatus: order.paymentStatus as PaymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return { orders: mappedOrders };
  } catch (error) {
    return { error: "Failed to fetch orders." };
  }
}
