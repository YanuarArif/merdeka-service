import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle, Mail } from "lucide-react";

export default function PaymentErrorPage() {
  return (
    <>
      <XCircle className="h-16 w-16 text-red-500" />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="text-muted-foreground max-w-md">
          We apologize, but there was an issue processing your payment. This
          could be due to insufficient funds, incorrect card details, or a
          temporary system issue.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/orders">Try Again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>Need help? Contact support at support@merdeka-service.com</span>
        </div>
      </div>
    </>
  );
}
