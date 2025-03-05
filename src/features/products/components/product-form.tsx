"use client";

import { createProduct } from "@/app/actions/create-product";
import { updateProduct } from "@/app/actions/update-product";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useProductForm, ProductFormData } from "../hooks/use-product-form";
import { ProductDescription } from "./product-description";
import { ProductCategories } from "./product-categories";
import { ProductShipping } from "./product-shipping";
import { ProductImages } from "./product-images";
import { ProductInventory } from "./product-inventory";
import { ProductPricing } from "./product-pricing";

interface ProductFormProps {
  initialData: Product | null;
  pageTitle: string;
}

export default function ProductForm({
  initialData,
  pageTitle,
}: ProductFormProps) {
  const form = useProductForm(initialData);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isEditMode = !!initialData;

  async function onSubmit(values: ProductFormData) {
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateProduct(initialData.id, {
              name: values.name,
              description: values.description || undefined,
              price: values.price,
              stock: values.stock || 0,
              imageUrls: values.imageUrls,
              category: values.category,
              subCategory: values.subCategory || undefined,
              weight: values.weight || undefined,
              length: values.length || undefined,
              breadth: values.breadth || undefined,
              width: values.width || undefined,
              sku: values.sku || undefined,
            })
          : await createProduct({
              name: values.name,
              description: values.description || undefined,
              price: values.price,
              stock: values.stock || 0,
              imageUrls: values.imageUrls,
              category: values.category,
              subCategory: values.subCategory || undefined,
              weight: values.weight || undefined,
              length: values.length || undefined,
              breadth: values.breadth || undefined,
              width: values.width || undefined,
              sku: values.sku || undefined,
            });

        if (result?.error) {
          toast.error(result.error as string);
        } else if (result?.success) {
          toast.success(
            initialData
              ? "Product updated successfully"
              : "Product added successfully"
          );
          form.reset();
          router.push("/dashboard/products");
        }
      } catch (error) {
        toast.error("An error occurred while saving the product");
      }
    });
  }

  return (
    <div className="container max-w-full px-4 py-6 md:max-w-4xl lg:max-w-7xl space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
        <Link
          href="/shop"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          View Shop
        </Link>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
          {/* Left Column - Description, Categories and Shipping */}
          <div className="space-y-6">
            <ProductDescription
              form={form}
              initialDescription={initialData?.description || ""}
            />
            <ProductCategories form={form} />
            <ProductShipping form={form} />
          </div>

          {/* Right Column - Images, Categories, Inventory, Pricing */}
          <div className="space-y-6">
            <ProductImages form={form} initialImages={initialData?.imageUrls} />
            <ProductInventory form={form} />
            <ProductPricing form={form} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={isPending}>
          Discard
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          onClick={() => form.handleSubmit(onSubmit)()}
        >
          {isPending
            ? isEditMode
              ? "Updating Product..."
              : "Adding Product..."
            : isEditMode
              ? "Update Product"
              : "Add Product"}
        </Button>
      </div>
    </div>
  );
}
