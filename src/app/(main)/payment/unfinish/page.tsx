import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function PaymentUnfinishPage() {
  return (
    <>
      <AlertCircle className="h-16 w-16 text-yellow-500" />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-yellow-600">
          Payment Incomplete
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your payment process was not completed. You can try to complete the
          payment again or choose a different payment method.
        </p>
        <p className="text-sm text-muted-foreground">
          Note: Your order is saved and you can continue from where you left
          off.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard/orders">Complete Payment</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Back to Shopping</Link>
        </Button>
      </div>
    </>
  );
}
