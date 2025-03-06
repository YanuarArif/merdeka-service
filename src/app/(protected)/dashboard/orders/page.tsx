import { OrderList } from "@/features/orders/components/order-list";
import { getOrders } from "@/app/actions/get-orders";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export const metadata = {
  title: "Orders",
  description: "Manage your orders",
};

export default async function OrdersPage() {
  const { orders, error } = await getOrders();

  if (error) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between">
          <Heading title="Orders" description="Manage your orders" />
        </div>
        <Card className="p-6">
          <div className="text-destructive">{error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between">
        <Heading title="Orders" description="Manage your orders" />
      </div>
      <Card className="p-6">
        <OrderList orders={orders || []} />
      </Card>
    </div>
  );
}
