import { Card } from "@/components/ui/card";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-3xl py-10">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-6">{children}</div>
      </Card>
    </div>
  );
}
