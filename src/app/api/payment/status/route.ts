import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import { OrderStatus, PaymentStatus } from "@/types/order";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initial status check
        let order = await database.order.findUnique({
          where: { id: orderId },
          select: { status: true, paymentStatus: true },
        });

        if (!order) {
          controller.enqueue(
            `data: ${JSON.stringify({ error: "Order not found" })}\n\n`
          );
          controller.close();
          return;
        }

        // Send initial status
        controller.enqueue(
          `data: ${JSON.stringify({
            status: order.status,
            paymentStatus: order.paymentStatus,
          })}\n\n`
        );

        // Keep checking status until final state is reached
        while (
          order?.paymentStatus !== PaymentStatus.PAID &&
          order?.paymentStatus !== PaymentStatus.FAILED &&
          order?.status !== OrderStatus.CANCELLED
        ) {
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Check every 3 seconds

          order = await database.order.findUnique({
            where: { id: orderId },
            select: { status: true, paymentStatus: true },
          });

          if (order) {
            controller.enqueue(
              `data: ${JSON.stringify({
                status: order.status,
                paymentStatus: order.paymentStatus,
              })}\n\n`
            );
          }
        }

        controller.close();
      } catch (error) {
        console.error("Status streaming error:", error);
        controller.enqueue(
          `data: ${JSON.stringify({ error: "Status check failed" })}\n\n`
        );
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}
