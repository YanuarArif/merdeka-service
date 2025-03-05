import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../hooks/use-product-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductShippingProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductShipping({ form }: ProductShippingProps) {
  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-medium">Pengiriman dan Pengantaran</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Berat Barang</Label>
          <div className="flex items-center">
            <Input
              id="weight"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="rounded-r-none"
              {...form.register("weight")}
            />
            <Select defaultValue="kg">
              <SelectTrigger className="w-20 rounded-l-none">
                <SelectValue placeholder="kg" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.formState.errors.weight?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.weight.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Ukuran Paket (Paket yang Anda gunakan untuk mengirim produk)
          </Label>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Panjang</Label>
              <div className="flex items-center">
                <Input
                  id="length"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-r-none"
                  {...form.register("length")}
                />
                <Select defaultValue="in">
                  <SelectTrigger className="w-16 rounded-l-none">
                    <SelectValue placeholder="in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breadth">Lebar</Label>
              <div className="flex items-center">
                <Input
                  id="breadth"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-r-none"
                  {...form.register("breadth")}
                />
                <Select defaultValue="in">
                  <SelectTrigger className="w-16 rounded-l-none">
                    <SelectValue placeholder="in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">Tinggi</Label>
              <div className="flex items-center">
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-r-none"
                  {...form.register("width")}
                />
                <Select defaultValue="in">
                  <SelectTrigger className="w-16 rounded-l-none">
                    <SelectValue placeholder="in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
