"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { PaymentButton } from "@/components/payment/PaymentButton";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus } from "@/types/order";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<{
    id: string;
    total: number;
    status: OrderStatus;
    items: any[];
    customerDetails?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
  } | null>(null);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No order ID provided",
      });
      router.push("/dashboard/cart");
      return;
    }

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load order details",
        });
        router.push("/dashboard/cart");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, router, toast]);

  const handlePaymentSuccess = async () => {
    // Redirect to order details page
    router.push(`/dashboard/orders/${orderId}`);
  };

  const handlePaymentError = () => {
    // Handle payment error (order will be automatically cancelled by webhook)
    router.push("/dashboard/cart");
  };

  if (isLoading || !orderDetails) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {orderDetails.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{formatCurrency(orderDetails.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Complete your purchase by clicking the payment button below. You
              will be redirected to our secure payment gateway.
            </p>
            <PaymentButton
              paymentDetails={{
                orderId: orderDetails.id,
                amount: Math.round(orderDetails.total * 100), // Convert to cents
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
