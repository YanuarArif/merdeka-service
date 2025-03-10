import { coreApi } from "@/lib/midtrans";
import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentStatus } from "@/types/order";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify the notification is from Midtrans
    try {
      const notificationObject = await coreApi.transaction.notification(body);
      const orderId = notificationObject.order_id;
      const transactionStatus = notificationObject.transaction_status;
      const fraudStatus = notificationObject.fraud_status;

      // Default status
      let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
      let orderStatus: OrderStatus = OrderStatus.PENDING;

      // Update status based on Midtrans response
      if (transactionStatus === "capture") {
        if (fraudStatus === "challenge") {
          // Do nothing, wait for manual review
          paymentStatus = PaymentStatus.PENDING;
          orderStatus = OrderStatus.PENDING;
        } else if (fraudStatus === "accept") {
          paymentStatus = PaymentStatus.PAID;
          orderStatus = OrderStatus.PROCESSING;
        }
      } else if (transactionStatus === "settlement") {
        paymentStatus = PaymentStatus.PAID;
        orderStatus = OrderStatus.PROCESSING;
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "deny"
      ) {
        paymentStatus = PaymentStatus.FAILED;
        orderStatus = OrderStatus.CANCELLED;
      } else if (transactionStatus === "pending") {
        paymentStatus = PaymentStatus.PENDING;
        orderStatus = OrderStatus.PENDING;
      } else if (transactionStatus === "expire") {
        paymentStatus = PaymentStatus.FAILED;
        orderStatus = OrderStatus.CANCELLED;
      } else if (transactionStatus === "refund") {
        paymentStatus = PaymentStatus.REFUNDED;
        orderStatus = OrderStatus.CANCELLED;
      }

      // Update order status in database
      await database.order.update({
        where: { id: orderId },
        data: {
          paymentStatus,
          status: orderStatus,
        },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error processing Midtrans notification:", error);
      return NextResponse.json(
        { error: "Invalid notification" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error handling payment notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
