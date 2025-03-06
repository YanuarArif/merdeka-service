import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CartLoading() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between">
        <Heading
          title="Shopping Cart"
          description="Manage your cart items and proceed to checkout"
        />
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr,400px]">
        <Card className="p-6">
          <div className="space-y-4">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b pb-4 last:border-0"
                >
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
