import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../hooks/use-product-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductInventoryProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductInventory({ form }: ProductInventoryProps) {
  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-medium">Inventory</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            placeholder="Enter stock"
            {...form.register("stock")}
          />
          {form.formState.errors.stock?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.stock.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="sku">SKU (Optional)</Label>
          <Input id="sku" placeholder="Enter SKU" {...form.register("sku")} />
          {form.formState.errors.sku?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.sku.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
