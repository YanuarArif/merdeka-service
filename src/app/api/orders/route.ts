import { auth } from "@/lib/auth";
import { database } from "@/lib/database";
import { generateOrderNumber } from "@/lib/order-number";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's cart
    const cart = await database.cart.findFirst({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price.toNumber(),
      0
    );

    // Generate readable order number
    const orderNumber = await generateOrderNumber(database);

    // Create order with items
    const order = await database.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount: totalAmount,
        shippingAddress: {}, // Will be updated during checkout
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear the cart
    await database.cart.delete({
      where: {
        id: cart.id,
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
