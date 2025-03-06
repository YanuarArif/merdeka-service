import { getOrder } from "@/app/actions/get-order";
import { OrderDetails } from "@/features/orders/components/order-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Update the interface to match Next.js page props pattern
interface OrderPageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { order, error } = await getOrder(params.id);

  if (error || !order) {
    return notFound();
  }

  // Rest of your component remains the same
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              View and manage order details
            </p>
          </div>
        </div>
      </div>
      <Card className="p-6">
        <OrderDetails order={order} />
      </Card>
    </div>
  );
}
