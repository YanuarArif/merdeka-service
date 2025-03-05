import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../hooks/use-product-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface ProductPricingProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductPricing({ form }: ProductPricingProps) {
  const [formattedPrice, setFormattedPrice] = useState("");
  
  // Format number to IDR format (with thousand separators)
  const formatToIDR = (value: string) => {
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, "");
    
    // Format with thousand separators
    if (numericValue) {
      return new Intl.NumberFormat("id-ID").format(parseInt(numericValue));
    }
    return "";
  };
  
  // Handle input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update the formatted display value
    setFormattedPrice(formatToIDR(value));
    
    // Update the actual form value (numeric only)
    const numericValue = value.replace(/\D/g, "");
    form.setValue("price", numericValue ? parseFloat(numericValue) : 0);
  };
  
  // Initialize formatted value from form
  useEffect(() => {
    const currentPrice = form.getValues("price");
    if (currentPrice) {
      setFormattedPrice(formatToIDR(currentPrice.toString()));
    }
  }, [form]);

  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-medium">Pricing</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <div className="flex">
            <div className="flex items-center justify-center bg-muted border border-r-0 rounded-l-md px-3">
              IDR
            </div>
            <Input
              id="price"
              type="text"
              placeholder="0"
              className="rounded-l-none"
              value={formattedPrice}
              onChange={handlePriceChange}
              inputMode="numeric"
            />
          </div>
          {form.formState.errors.price?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
