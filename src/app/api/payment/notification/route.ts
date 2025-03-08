import { coreApi } from "@/lib/midtrans";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import { OrderStatus, PaymentStatus } from "@/types/order";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const statusResponse = await coreApi.transaction.notification(body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Payment type: ${paymentType}. Fraud status: ${fraudStatus}`
    );

    const order = await database.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handle the transaction status
    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        await database.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PaymentStatus.PENDING,
            status: OrderStatus.PENDING,
          },
        });
      } else if (fraudStatus === "accept") {
        await database.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            status: OrderStatus.PROCESSING,
          },
        });
      }
    } else if (transactionStatus === "settlement") {
      await database.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PROCESSING,
        },
      });
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      await database.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
          status: OrderStatus.CANCELLED,
        },
      });
    } else if (transactionStatus === "pending") {
      await database.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to process notification" },
      { status: 500 }
    );
  }
}
