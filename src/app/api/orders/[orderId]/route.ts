import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { serializePrismaObject } from "@/lib/prisma-serializer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> } // Fix: params is a Promise
) {
  try {
    const resolvedParams = await params; // Fix: Await the Promise
    const orderId = resolvedParams.orderId; // Access orderId after awaiting

    const order = await database.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrls: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Serialize Prisma objects (like Decimal) to plain JavaScript types
    const serializedOrder = serializePrismaObject(order);

    // Format the response
    return NextResponse.json({
      id: serializedOrder.id,
      total: Number(serializedOrder.totalAmount), // Ensure it's a number
      status: serializedOrder.status,
      items: serializedOrder.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price), // Ensure it's a number
        product: item.product,
      })),
      customerDetails: {
        firstName: serializedOrder.user?.name?.split(" ")[0],
        lastName: serializedOrder.user?.name?.split(" ").slice(1).join(" "),
        email: serializedOrder.user?.email,
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
