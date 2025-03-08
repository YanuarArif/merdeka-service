"use client";

import { useState } from "react";
import { PaymentButton } from "@/components/payment/PaymentButton";
import { Card } from "@/components/ui/card";
import { Order, PaymentStatus } from "@/types/order";
import { useRouter } from "next/navigation";

interface PaymentSectionProps {
  order: Order;
}

export function PaymentSection({ order }: PaymentSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (order.paymentStatus !== PaymentStatus.PENDING) {
    return null;
  }

  const handlePaymentSuccess = (result: any) => {
    setIsProcessing(false);
    // Refresh the page to show updated payment status
    router.refresh();
  };

  const handlePaymentPending = (result: any) => {
    setIsProcessing(false);
    router.refresh();
  };

  const handlePaymentError = (error: any) => {
    setIsProcessing(false);
    router.refresh();
  };

  const handlePaymentClose = () => {
    setIsProcessing(false);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Complete Payment
            </p>
            <p className="text-sm text-muted-foreground">
              Please complete your payment to process the order
            </p>
          </div>
          <PaymentButton
            paymentDetails={{
              orderId: order.id,
              amount: order.totalAmount,
              customerDetails: {
                firstName: order.shippingAddress.fullName.split(" ")[0],
                lastName: order.shippingAddress.fullName
                  .split(" ")
                  .slice(1)
                  .join(" "),
                phone: order.shippingAddress.phone,
              },
            }}
            onSuccess={handlePaymentSuccess}
            onPending={handlePaymentPending}
            onError={handlePaymentError}
            onClose={handlePaymentClose}
            mode="popup"
            className="min-w-[120px]"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </PaymentButton>
        </div>
      </div>
    </Card>
  );
}
