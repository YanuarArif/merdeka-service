"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "@/hooks/use-toast";

interface ProductDetailProps {
  maincategory: string;
  nameproduct: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrls: string[];
  category: string | null;
  subCategory: string | null;
  stock: number;
  averageRating: number;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      name: string | null;
      image: string | null;
    };
  }>;
}

export default function ProductDetail({
  maincategory,
  nameproduct,
}: ProductDetailProps) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(maincategory)}&name=${encodeURIComponent(nameproduct)}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch product (this product detail)");
        const productData = await response.json();
        if (!productData || typeof productData === "string")
          throw new Error("Product not found");
        setProduct(productData);
        setMainImage(
          productData.imageUrls[0] || "/images/laptops/lenovo-laptop.jpg"
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [maincategory, nameproduct]);

  const handleAddToCart = () => {
    if (!product) return;

    addItemToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.imageUrls[0] || "/images/laptops/lenovo-laptop.jpg",
      quantity: quantity,
    });

    toast({
      description: `${product.name} added to cart!`,
    });
  };

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 w-1/3 mb-8" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 w-3/4" />
            <div className="h-4 bg-gray-200 w-1/4" />
            <div className="h-12 bg-gray-200 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  const thumbnails =
    product.imageUrls.length > 0
      ? product.imageUrls
      : ["/images/laptops/lenovo-laptop.jpg"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${maincategory}`} className="hover:text-primary">
          {maincategory || "All Products"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {thumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className="w-20 h-20 border rounded-lg overflow-hidden cursor-pointer hover:border-primary"
                onMouseEnter={() => setMainImage(thumb)}
              >
                <Image
                  src={thumb}
                  alt={`Product thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="object-contain w-full h-auto"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div
            className="flex-1 border rounded-lg overflow-hidden relative cursor-zoom-in"
            onClick={handleImageClick}
          >
            <Image
              src={mainImage || "/images/laptops/lenovo-laptop.jpg"}
              alt="Product main image"
              width={600}
              height={600}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4">
              <Truck className="w-4 h-4 mr-1" />
              Local warehouse
            </div>
            <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.averageRating)
                        ? "text-primary fill-primary"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </span>
            </div>

            <div className="bg-orange-100 text-orange-700 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Big sale ends in 17:22:09:52</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Select
                value={quantity.toString()}
                onValueChange={(value) => setQuantity(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleAddToCart}>
                Add to cart
              </Button>
              <Button className="flex-1" variant="secondary">
                Buy now
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free shipping on orders over $30</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Secure payment & buyer protection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Image Preview */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={mainImage || "/images/laptops/lenovo-laptop.jpg"}
              alt="Product preview"
              width={800}
              height={800}
              className="object-contain w-full h-auto"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white text-black hover:bg-gray-200"
              onClick={handleClosePopup}
            >
              <span className="text-2xl">×</span>
            </Button>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-primary fill-primary"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet</p>
        )}
      </div>
    </div>
  );
}
