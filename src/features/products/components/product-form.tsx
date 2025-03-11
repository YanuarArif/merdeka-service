// src/components/ProductForm.tsx
"use client";

import { createProduct } from "@/app/actions/create-product";
import { updateProduct } from "@/app/actions/update-product";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useProductForm, ProductFormData } from "../hooks/use-product-form";
import { ProductDescription } from "./product-description";
import { ProductCategories } from "./product-categories";
import { ProductShipping } from "./product-shipping";
import { ProductImages } from "./product-images";
import { ProductInventory } from "./product-inventory";
import { ProductPricing } from "./product-pricing";
import { usePreventNavigation } from "@/hooks/use-prevent-navigation";

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const isEditMode = !!initialData;

  // Debug log to verify isDirty
  useEffect(() => {
    console.log("Form is dirty:", form.formState.isDirty);
  }, [form.formState.isDirty]);

  const {
    showDialog: showConfirmDialog,
    setShowDialog: setShowConfirmDialog,
    confirmNavigation,
    cancelNavigation,
  } = usePreventNavigation({
    shouldPrevent: form.formState.isDirty && !isSubmitting, // Disable prevention during submission
    onNavigate: () => {
      form.reset(); // Reset form on navigation confirmation
    },
  });

  async function onSubmit(values: ProductFormData) {
    setIsSubmitting(true); // Set submitting state to disable prevention
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateProduct(initialData.id, {
              name: values.name,
              description: values.description || undefined,
              price: values.price,
              stock: values.stock || 0,
              imageUrls: values.imageUrls, // Use existing imageUrls or updated ones
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
              ? "Produk berhasil diperbarui"
              : "Produk berhasil ditambahkan"
          );
          form.reset(); // Reset form immediately after success
          router.push("/dashboard/products"); // Navigate only after reset
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menyimpan produk");
      } finally {
        setIsSubmitting(false); // Reset submitting state
      }
    });
  }

  return (
    <div className="container max-w-full px-4 py-6 md:max-w-4xl lg:max-w-7xl space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (form.formState.isDirty && !isSubmitting) {
                setShowConfirmDialog(true);
              } else {
                router.push("/dashboard/products");
              }
            }}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
        <Link
          href="/shop"
          onClick={(e) => {
            if (form.formState.isDirty && !isSubmitting) {
              e.preventDefault();
              setShowConfirmDialog(true);
            }
          }}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Lihat Toko
        </Link>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
          <div className="space-y-6">
            <ProductDescription
              form={form}
              initialDescription={initialData?.description || ""}
            />
            <ProductCategories form={form} />
            <ProductShipping form={form} />
          </div>
          <div className="space-y-6">
            <ProductImages form={form} initialImages={initialData?.imageUrls} />
            <ProductInventory form={form} />
            <ProductPricing form={form} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => {
            if (form.formState.isDirty && !isSubmitting) {
              setShowConfirmDialog(true);
            } else {
              router.push("/dashboard/products");
            }
          }}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          onClick={() => form.handleSubmit(onSubmit)()}
        >
          {isPending
            ? isEditMode
              ? "Memperbarui Produk..."
              : "Menambah Produk..."
            : isEditMode
              ? "Perbarui Produk"
              : "Tambah Produk"}
        </Button>
      </div>

      <Dialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowConfirmDialog(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Batalkan Perubahan?</DialogTitle>
            <DialogDescription>
              Perubahan yang Anda buat akan hilang. Apakah Anda yakin ingin
              membatalkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelNavigation}>
              Tidak, Lanjutkan
            </Button>
            <Button variant="destructive" onClick={confirmNavigation}>
              Ya, Batalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
