// src/components/CartPopup.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, XCircle } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/lib/utils";

const CartPopup = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleIncreaseQuantity = (productId: string) => {
    increaseQuantity(productId);
  };

  const handleDecreaseQuantity = (productId: string) => {
    decreaseQuantity(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
        <p className="text-center text-gray-500">
          Your cart is empty. Add items to proceed with your shopping.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
      <p className="text-sm text-gray-500">
        {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
      </p>

      {/* Cart Items */}
      <ScrollArea className="max-h-[40vh] pr-4">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md aspect-square object-cover border border-gray-200"
                  />
                )}
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleDecreaseQuantity(item.productId)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleIncreaseQuantity(item.productId)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full h-10 w-10"
                onClick={() => handleRemoveItem(item.productId)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="space-y-4">
        <Separator />
        <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
          <span>Subtotal</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <Button
          variant="destructive"
          className="w-full rounded-lg hover:bg-red-600 transition-colors"
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>
        <Button className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPopup;
