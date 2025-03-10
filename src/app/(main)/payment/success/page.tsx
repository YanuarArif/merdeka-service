import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <>
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard/orders">View Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </>
  );
}
