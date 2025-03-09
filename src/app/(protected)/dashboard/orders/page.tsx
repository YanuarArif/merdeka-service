import { OrderList } from "@/features/orders/components/order-list";
import { getOrders } from "@/app/actions/get-orders";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Orders",
  description: "Manage your orders",
};

export default async function OrdersPage() {
  const { orders, error } = await getOrders();

  // console.log("Orders page data:", { orders, error });

  if (error) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between">
          <Heading title="Orders" description="View and track your orders" />
        </div>
        <Card className="p-6">
          <div className="text-destructive">{error}</div>
        </Card>
      </div>
    );
  }

  // Count orders by status
  const pendingOrders =
    orders?.filter((order) => order.status === "PENDING") || [];
  // console.log("Filtered pending orders:", pendingOrders);

  const processingOrders =
    orders?.filter((order) => order.status === "PROCESSING") || [];
  // console.log("Filtered processing orders:", processingOrders);

  const completedOrders =
    orders?.filter((order) =>
      ["DELIVERED", "SHIPPED"].includes(order.status)
    ) || [];
  // console.log("Filtered completed orders:", completedOrders);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between">
        <Heading
          title={`Orders ${orders?.length ? `(${orders.length})` : ""}`}
          description="View and track your orders"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Pending</h3>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {pendingOrders.length}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Awaiting confirmation
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Processing</h3>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {processingOrders.length}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Being prepared
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Completed</h3>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {completedOrders.length}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Delivered/Shipped
            </span>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All Orders ({orders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({processingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <OrderList orders={orders || []} key="all" />
          </TabsContent>
          <TabsContent value="pending">
            <OrderList orders={pendingOrders} key="pending" />
          </TabsContent>
          <TabsContent value="processing">
            <OrderList orders={processingOrders} key="processing" />
          </TabsContent>
          <TabsContent value="completed">
            <OrderList orders={completedOrders} key="completed" />
          </TabsContent>
        </Tabs>
        {orders?.length === 0 && (
          <div className="text-sm text-muted-foreground mt-4 text-center py-8">
            No orders found. Start shopping to see your orders here!
          </div>
        )}
      </Card>
    </div>
  );
}
