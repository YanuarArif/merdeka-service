"use client";

import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

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
  className,
  children,
}: PaymentButtonProps) {
  const snapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
    );
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = useCallback(async () => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const { token } = await response.json();

      if (!token) {
        throw new Error("No payment token received");
      }

      const options: SnapOptions = {
        onSuccess: (result: any) => {
          console.log("Payment success:", result);
          onSuccess?.(result);
        },
        onPending: (result: any) => {
          console.log("Payment pending:", result);
          onPending?.(result);
        },
        onError: (result: any) => {
          console.error("Payment error:", result);
          onError?.(result);
        },
        onClose: () => {
          console.log("Payment dialog closed");
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
      console.error("Payment error:", error);
      onError?.(error);
    }
  }, [paymentDetails, mode, onSuccess, onPending, onError, onClose]);

  return (
    <div>
      <Button onClick={handlePayment} className={className}>
        {children || "Pay Now"}
      </Button>
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
