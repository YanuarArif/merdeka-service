"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus, PaymentStatus } from "@/types/order";
import { formatCurrency } from "@/lib/utils";

interface SnapOptions {
  onSuccess: (result: any) => void;
  onPending: (result: any) => void;
  onError: (result: any) => void;
  onClose: () => void;
  embedId?: string;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapOptions) => void;
      embed: (token: string, options: SnapOptions) => void;
    };
  }
}

type PaymentDetails = {
  orderId: string;
  amount: number;
  customerDetails?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
};

type PaymentButtonProps = {
  paymentDetails: PaymentDetails;
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
  mode?: "popup" | "embed";
  className?: string;
  children?: React.ReactNode;
};

export function PaymentButton({
  paymentDetails,
  onSuccess,
  onPending,
  onError,
  onClose,
  mode = "popup",
  className = "",
  children,
}: PaymentButtonProps) {
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const statusEventSourceRef = useRef<EventSource | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
    );

    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load payment module. Please refresh the page.",
      });
    };

    document.head.appendChild(script);

    return () => {
      if (statusEventSourceRef.current) {
        statusEventSourceRef.current.close();
      }
      document.head.removeChild(script);
    };
  }, [toast]);

  // Payment status monitoring
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (paymentStatus === PaymentStatus.PENDING) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [paymentStatus]);

  // Format time left
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const monitorPaymentStatus = (orderId: string) => {
    // Clean up any existing EventSource
    if (statusEventSourceRef.current) {
      statusEventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `/api/payment/status?orderId=${orderId}`
    );
    statusEventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Status Error",
          description: data.error,
        });
        eventSource.close();
        return;
      }

      setPaymentStatus(data.paymentStatus);
      setOrderStatus(data.status);

      if (data.paymentStatus === PaymentStatus.PAID) {
        toast({
          title: "Payment Completed",
          description: "Your payment has been confirmed.",
        });
        eventSource.close();
      } else if (
        data.paymentStatus === PaymentStatus.FAILED ||
        data.status === OrderStatus.CANCELLED
      ) {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "The payment was unsuccessful or cancelled.",
        });
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description:
          "Failed to monitor payment status. Please refresh the page.",
      });
      eventSource.close();
    };

    return eventSource;
  };

  const handlePayment = useCallback(async () => {
    if (!scriptLoaded) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Payment module is not ready. Please wait or refresh the page.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a copy of payment details with the correct amount format
      const paymentPayload = {
        ...paymentDetails,
        // Ensure we're sending the exact amount without any conversion
        // Midtrans expects the amount in the smallest currency unit (IDR)
        amount: Math.round(paymentDetails.amount)
      };

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `payment_${paymentDetails.orderId}_${Date.now()}`,
        },
        body: JSON.stringify(paymentPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment");
      }

      const { data } = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error("No payment token received");
      }

      const options: SnapOptions = {
        onSuccess: (result: any) => {
          setIsLoading(false);
          monitorPaymentStatus(paymentDetails.orderId);
          setTimeLeft(900); // Reset timer to 15 minutes
          setPaymentStatus(PaymentStatus.PENDING);
          toast({
            title: "Payment Initiated",
            description:
              "Your payment is being processed. Please complete the payment.",
          });
          onSuccess?.(result);
        },
        onPending: (result: any) => {
          setIsLoading(false);
          setPaymentStatus(PaymentStatus.PENDING);
          toast({
            title: "Payment Pending",
            description: "Please complete the payment within the time limit.",
          });
          onPending?.(result);
        },
        onError: (result: any) => {
          setIsLoading(false);
          setPaymentStatus(PaymentStatus.FAILED);
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description:
              result?.message ||
              "An error occurred during payment. Please try again.",
          });
          onError?.(result);
        },
        onClose: () => {
          setIsLoading(false);
          toast({
            title: "Payment Window Closed",
            description: "You can reopen the payment window anytime.",
          });
          onClose?.();
        },
      };

      if (mode === "embed" && snapContainerRef.current) {
        options.embedId = snapContainerRef.current.id;
        window.snap.embed(token, options);
      } else {
        window.snap.pay(token, options);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
      onError?.(error);
    }
  }, [
    paymentDetails,
    mode,
    onSuccess,
    onPending,
    onError,
    onClose,
    scriptLoaded,
    toast,
  ]);

  return (
    <div>
      <Button
        onClick={handlePayment}
        className={`${className} ${isLoading ? "cursor-not-allowed" : ""}`}
        disabled={isLoading || !scriptLoaded}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          children || `Pay ${formatCurrency(paymentDetails.amount)}`
        )}
      </Button>
      {paymentStatus === PaymentStatus.PENDING && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <Timer className="mr-1 h-4 w-4" />
          Time remaining: {formatTimeLeft()}
        </div>
      )}
      {mode === "embed" && (
        <div
          id="snap-container"
          ref={snapContainerRef}
          style={{
            minHeight: "560px",
            marginTop: "24px",
          }}
        />
      )}
    </div>
  );
}
