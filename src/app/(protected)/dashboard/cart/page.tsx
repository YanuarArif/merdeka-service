import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { database } from "@/lib/database";
import { CartList, CartActions, CartWithItems } from "@/features/cart";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const cart = (await database.cart.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })) as CartWithItems | null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Shopping Cart</h2>
      </div>
      <div className="grid gap-4">
        {cart ? (
          <>
            <CartList cart={cart} />
            <CartActions cartId={cart.id} />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
