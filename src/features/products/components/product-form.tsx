"use client";

import { createProduct } from "@/app/actions/create-product";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/constants/mock-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  category: z.string(),
  price: z.coerce.number(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrl: z.string().min(1, "Image URL is required").optional(),
});

export default function ProductForm({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || "",
    category: initialData?.category || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const route = useRouter();
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>("");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      let imageUrlToSubmit = values.imageUrl;
      if (uploadedImageUrl) {
        imageUrlToSubmit = uploadedImageUrl;
      }

      if (!imageUrlToSubmit) {
        toast.error("Please upload an image");
        return;
      }

      const result = await createProduct({
        ...values,
        imageUrl: imageUrlToSubmit,
      });

      if (result?.error) {
        toast.error(result.error as string);
      } else if (result?.success) {
        toast.success("Produk berhasil ditambahkan");
        form.reset();
        route.push("/dashboard/product");
      }
    });
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={async (files) => {
                          const newFiles = files as File[];
                          field.onChange(newFiles);

                          if (newFiles && newFiles.length > 0) {
                            setUploadingImg(true);
                            try {
                              const blob = await put(
                                newFiles[0].name,
                                newFiles[0],
                                {
                                  access: "public",
                                  token:
                                    process.env
                                      .NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
                                }
                              );
                              setUploadedImageUrl(blob.url);
                              form.setValue("imageUrl", blob.url);
                            } catch (uploadError) {
                              console.error(
                                "Error uploading image:",
                                uploadError
                              );
                              toast.error("Error uploading image");
                              setUploadedImageUrl(null);
                              form.setValue("imageUrl", "");
                            } finally {
                              setUploadingImg(false);
                            }
                          } else {
                            setUploadedImageUrl(null);
                            form.setValue("imageUrl", "");
                          }
                        }}
                        accept={{ "image/*": ACCEPTED_IMAGE_TYPES }}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        disabled={uploadingImg}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  {uploadingImg && (
                    <p className="text-muted-foreground text-sm">
                      Uploading image...
                    </p>
                  )}
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select categories" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beauty">Beauty Products</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">
                          Sports & Outdoors
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending || uploadingImg}>
              {isPending
                ? "Menambah Produk..."
                : uploadingImg
                  ? "Uploading image..."
                  : "Tambah Produk"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
